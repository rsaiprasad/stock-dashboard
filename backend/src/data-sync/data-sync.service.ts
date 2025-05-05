import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockBarEntity, TimeframeEnum } from '../stock/stock-bar.entity';
import { OptionDataEntity } from '../option/option-data.entity';
import { AlpacaService } from '../alpaca/alpaca.service';
import { ConfigService } from '@nestjs/config';

export interface SyncStatus {
  lastSync: Date | null;
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  message: string;
  details?: Record<string, unknown>;
}

// Mock option data structure for development
interface OptionData {
  symbol: string;
  expiration_date: string;
  strike_price: number;
  option_type: string;
  open_interest: number;
  volume: number;
}

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);
  private readonly symbols: string[];
  private syncStatus: SyncStatus = {
    lastSync: null,
    status: 'idle',
    message: 'No sync has been performed yet',
  };

  constructor(
    @InjectRepository(StockBarEntity)
    private stockBarRepository: Repository<StockBarEntity>,
    @InjectRepository(OptionDataEntity)
    private optionDataRepository: Repository<OptionDataEntity>,
    private alpacaService: AlpacaService,
    private configService: ConfigService,
  ) {
    // Initialize with default symbols or from config
    this.symbols = this.configService
      .get<string>('STOCK_SYMBOLS', 'AAPL,MSFT,AMZN,GOOGL,META')
      .split(',')
      .map((symbol) => symbol.trim());
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncHourlyData() {
    this.logger.log('Syncing hourly data...');

    try {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'syncing',
        message: 'Syncing hourly data',
      };

      // Get current date and time
      const end = new Date();
      // Get date 24 hours ago
      const start = new Date(end);
      start.setHours(start.getHours() - 24);

      // Fetch and save 1-hour bars for all symbols
      await this.fetchAndSaveStockBars(this.symbols, TimeframeEnum['1Hour'], start, end);

      this.syncStatus = {
        lastSync: new Date(),
        status: 'completed',
        message: 'Hourly data sync completed successfully',
      };

      this.logger.log('Hourly data sync completed successfully');
    } catch (error) {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'failed',
        message: `Error syncing hourly data: ${error.message}`,
        details: { error: error.message },
      };

      this.logger.error(`Error syncing hourly data: ${error.message}`, error.stack);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncDailyData() {
    this.logger.log('Syncing daily data...');

    try {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'syncing',
        message: 'Syncing daily data',
      };

      // Get current date
      const end = new Date();
      // Get date 30 days ago
      const start = new Date(end);
      start.setDate(start.getDate() - 30);

      // Fetch and save daily bars for all symbols
      await this.fetchAndSaveStockBars(this.symbols, TimeframeEnum['1Day'], start, end);

      // Fetch and save options data
      await this.fetchAndSaveOptionsData(this.symbols);

      this.syncStatus = {
        lastSync: new Date(),
        status: 'completed',
        message: 'Daily data sync completed successfully',
      };

      this.logger.log('Daily data sync completed successfully');
    } catch (error) {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'failed',
        message: `Error syncing daily data: ${error.message}`,
        details: { error: error.message },
      };

      this.logger.error(`Error syncing daily data: ${error.message}`, error.stack);
    }
  }

  /**
   * Get the current sync status
   */
  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  /**
   * Sync all data for all configured symbols
   */
  async syncAllData() {
    this.logger.log('Starting full data sync for all symbols...');

    try {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'syncing',
        message: 'Starting full data sync',
      };

      // Sync historical data for all symbols (last 5 years)
      for (const symbol of this.symbols) {
        await this.syncHistoricalDataForSymbol(symbol, 5);
      }

      // Sync options data for all symbols
      await this.fetchAndSaveOptionsData(this.symbols);

      this.syncStatus = {
        lastSync: new Date(),
        status: 'completed',
        message: 'Full data sync completed successfully',
      };

      this.logger.log('Full data sync completed successfully');
      return { success: true, message: 'Full data sync completed successfully' };
    } catch (error) {
      this.syncStatus = {
        lastSync: new Date(),
        status: 'failed',
        message: `Error during full data sync: ${error.message}`,
        details: { error: error.message },
      };

      this.logger.error(`Error during full data sync: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sync historical data for a specific symbol
   */
  async syncHistoricalDataForSymbol(symbol: string, years = 5) {
    this.logger.log(`Syncing historical data for ${symbol} (${years} years)...`);

    try {
      // Get current date
      const end = new Date();
      // Get date X years ago
      const start = new Date(end);
      start.setFullYear(start.getFullYear() - years);

      // Fetch daily data
      await this.fetchHistoricalStockData(symbol, TimeframeEnum['1Day'], start, end);

      // Fetch hourly data for the last 30 days
      const thirtyDaysAgo = new Date(end);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      await this.fetchHistoricalStockData(symbol, TimeframeEnum['1Hour'], thirtyDaysAgo, end);

      return {
        success: true,
        message: `Historical data sync completed for ${symbol}`,
        timeRange: { start: start.toISOString(), end: end.toISOString() },
      };
    } catch (error) {
      this.logger.error(
        `Error syncing historical data for ${symbol}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch historical stock data with flexible parameters
   */
  async fetchHistoricalStockData(
    symbol: string,
    timeframe: TimeframeEnum,
    startDate: Date,
    endDate: Date = new Date(),
  ): Promise<StockBarEntity[]> {
    this.logger.log(
      `Fetching ${timeframe} data for ${symbol} from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    try {
      const barsData = await this.alpacaService.getStockBars(symbol, timeframe, startDate, endDate);
      const stockBars: StockBarEntity[] = [];

      // Process the bars data
      const bars = barsData[symbol] || [];
      for (const bar of bars) {
        const stockBar = new StockBarEntity();
        stockBar.symbol = symbol;
        stockBar.timeframe = timeframe;
        stockBar.timestamp = new Date(bar.Timestamp || bar.t);
        stockBar.open = bar.OpenPrice || bar.o;
        stockBar.high = bar.HighPrice || bar.h;
        stockBar.low = bar.LowPrice || bar.l;
        stockBar.close = bar.ClosePrice || bar.c;
        stockBar.volume = bar.Volume || bar.v;
        stockBar.vwap = bar.VWAP || bar.vw || 0;
        stockBar.trade_count = bar.TradeCount || bar.n || 0;

        stockBars.push(stockBar);
      }

      // Save to database
      if (stockBars.length > 0) {
        await this.saveStockData(stockBars);
        this.logger.log(`Saved ${stockBars.length} stock bars for ${symbol}`);
      }

      return stockBars;
    } catch (error) {
      this.logger.error(
        `Error fetching historical stock data for ${symbol}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch options data with flexible parameters
   */
  async fetchOptionsData(
    symbol: string,
    expirationDate?: string,
    strikePrice?: number,
    optionType?: 'call' | 'put',
  ): Promise<OptionDataEntity[]> {
    this.logger.log(
      `Fetching options data for ${symbol}${expirationDate ? ` with expiration ${expirationDate}` : ''}`,
    );

    try {
      // Since the Alpaca API doesn't fully support options data in the free tier,
      // we'll create mock data for development purposes
      const mockOptions: OptionData[] = this.generateMockOptionsData(symbol, expirationDate);
      const optionsData: OptionDataEntity[] = [];

      // Filter and process options data
      for (const option of mockOptions) {
        // Skip if strike price filter is provided and doesn't match
        if (strikePrice && option.strike_price !== strikePrice) continue;

        // Skip if option type filter is provided and doesn't match
        if (optionType && option.option_type !== optionType) continue;

        const optionData = new OptionDataEntity();
        optionData.symbol = symbol;
        optionData.expiration_date = new Date(option.expiration_date);
        optionData.strike_price = option.strike_price;
        optionData.option_type = option.option_type as 'call' | 'put';
        optionData.open_interest = option.open_interest;
        optionData.volume = option.volume;

        optionsData.push(optionData);
      }

      // Save to database
      if (optionsData.length > 0) {
        await this.saveOptionData(optionsData);
        this.logger.log(`Saved ${optionsData.length} options data entries for ${symbol}`);
      }

      return optionsData;
    } catch (error) {
      this.logger.error(`Error fetching options data for ${symbol}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate mock options data for development
   */
  private generateMockOptionsData(symbol: string, expirationDate?: string): OptionData[] {
    const options: OptionData[] = [];
    const now = new Date();

    // Generate expiration dates (3rd Friday of next 3 months)
    const expirations: string[] = [];
    if (expirationDate) {
      expirations.push(expirationDate);
    } else {
      for (let i = 1; i <= 3; i++) {
        const expDate = new Date(now);
        expDate.setMonth(now.getMonth() + i);
        expDate.setDate(1);

        // Find the first Friday
        while (expDate.getDay() !== 5) {
          expDate.setDate(expDate.getDate() + 1);
        }

        // Move to the third Friday
        expDate.setDate(expDate.getDate() + 14);

        expirations.push(expDate.toISOString().split('T')[0]);
      }
    }

    // Generate strike prices around current price
    const basePrice = 100; // Mock current price
    const strikePrices = [
      basePrice * 0.8,
      basePrice * 0.9,
      basePrice * 0.95,
      basePrice,
      basePrice * 1.05,
      basePrice * 1.1,
      basePrice * 1.2,
    ];

    // Generate options data
    for (const exp of expirations) {
      for (const strike of strikePrices) {
        // Call option
        options.push({
          symbol,
          expiration_date: exp,
          strike_price: strike,
          option_type: 'call',
          open_interest: Math.floor(Math.random() * 1000),
          volume: Math.floor(Math.random() * 500),
        });

        // Put option
        options.push({
          symbol,
          expiration_date: exp,
          strike_price: strike,
          option_type: 'put',
          open_interest: Math.floor(Math.random() * 1000),
          volume: Math.floor(Math.random() * 500),
        });
      }
    }

    return options;
  }

  /**
   * Fetch historical data for initial setup
   */
  async fetchHistoricalData() {
    this.logger.log('Fetching historical data...');

    try {
      // Get current date
      const end = new Date();
      // Get date 10 years ago
      const start = new Date(end);
      start.setFullYear(start.getFullYear() - 10);

      // Fetch and save daily bars for all symbols for the past 10 years
      await this.fetchAndSaveStockBars(this.symbols, TimeframeEnum['1Day'], start, end);

      this.logger.log('Historical data fetch completed successfully');
    } catch (error) {
      this.logger.error(`Error fetching historical data: ${error.message}`, error.stack);
    }
  }

  /**
   * Fetch and save stock bars for multiple symbols
   */
  private async fetchAndSaveStockBars(
    symbols: string[],
    timeframe: TimeframeEnum,
    start: Date,
    end: Date,
  ) {
    this.logger.log(
      `Fetching ${timeframe} bars for ${symbols.join(', ')} from ${start.toISOString()} to ${end.toISOString()}`,
    );

    try {
      const barsData = await this.alpacaService.getMultipleStockBars(
        symbols,
        timeframe,
        start,
        end,
      );

      // Process and save the bars data
      const stockBars: StockBarEntity[] = [];

      // Process the bars data based on the SDK response format
      for (const symbol of Object.keys(barsData)) {
        const bars = barsData[symbol];

        for (const bar of bars) {
          const stockBar = new StockBarEntity();
          stockBar.symbol = symbol;
          stockBar.timeframe = timeframe;
          stockBar.timestamp = new Date(bar.Timestamp || bar.t);
          stockBar.open = bar.OpenPrice || bar.o;
          stockBar.high = bar.HighPrice || bar.h;
          stockBar.low = bar.LowPrice || bar.l;
          stockBar.close = bar.ClosePrice || bar.c;
          stockBar.volume = bar.Volume || bar.v;
          stockBar.vwap = bar.VWAP || bar.vw || 0;
          stockBar.trade_count = bar.TradeCount || bar.n || 0;

          stockBars.push(stockBar);
        }
      }

      if (stockBars.length > 0) {
        await this.saveStockData(stockBars);
        this.logger.log(`Saved ${stockBars.length} stock bars`);
      } else {
        this.logger.warn('No stock bars data to save');
      }
    } catch (error) {
      this.logger.error(`Error fetching and saving stock bars: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Fetch and save options data for multiple symbols
   */
  private async fetchAndSaveOptionsData(symbols: string[]) {
    this.logger.log(`Fetching options data for ${symbols.join(', ')}`);

    try {
      const optionsData: OptionDataEntity[] = [];

      for (const symbol of symbols) {
        // Generate mock options data for development
        const mockOptions = this.generateMockOptionsData(symbol);

        // Process options data
        for (const option of mockOptions) {
          const optionData = new OptionDataEntity();
          optionData.symbol = symbol;
          optionData.expiration_date = new Date(option.expiration_date);
          optionData.strike_price = option.strike_price;
          optionData.option_type = option.option_type as 'call' | 'put';
          optionData.open_interest = option.open_interest;
          optionData.volume = option.volume;

          optionsData.push(optionData);
        }
      }

      if (optionsData.length > 0) {
        await this.saveOptionData(optionsData);
        this.logger.log(`Saved ${optionsData.length} options data entries`);
      } else {
        this.logger.warn('No options data to save');
      }
    } catch (error) {
      this.logger.error(`Error fetching and saving options data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Save stock data to the database
   */
  private async saveStockData(stockData: StockBarEntity[]) {
    try {
      // Use upsert to handle duplicates
      await this.stockBarRepository.save(stockData);
    } catch (error) {
      this.logger.error(`Error saving stock data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Save option data to the database
   */
  private async saveOptionData(optionData: OptionDataEntity[]) {
    try {
      // Use upsert to handle duplicates
      await this.optionDataRepository.save(optionData);
    } catch (error) {
      this.logger.error(`Error saving option data: ${error.message}`, error.stack);
      throw error;
    }
  }
}
