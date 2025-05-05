import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Alpaca from '@alpacahq/alpaca-trade-api';

@Injectable()
export class AlpacaService {
  private readonly alpaca: Alpaca;
  private readonly logger = new Logger(AlpacaService.name);

  constructor(private configService: ConfigService) {
    // Initialize Alpaca client
    this.alpaca = new Alpaca({
      keyId: this.configService.get<string>('ALPACA_API_KEY', ''),
      secretKey: this.configService.get<string>('ALPACA_API_SECRET', ''),
      paper: true, // Set to false for live trading
      usePolygon: false,
    });
  }

  /**
   * Get historical bars for a single symbol
   */
  async getStockBars(symbol: string, timeframe: string, start: Date, end: Date) {
    try {
      const bars = await this.alpaca.getBarsV2(symbol, {
        start: start.toISOString(),
        end: end.toISOString(),
        timeframe: timeframe,
        limit: 10000,
      });

      // Convert iterator to array
      const barsArray = [];
      for await (const bar of bars) {
        barsArray.push(bar);
      }

      return { [symbol]: barsArray };
    } catch (error) {
      this.logger.error(`Error fetching stock bars for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get historical bars for multiple symbols
   */
  async getMultipleStockBars(symbols: string[], timeframe: string, start: Date, end: Date) {
    try {
      const result = {};

      // Alpaca API doesn't support multi-symbol requests in the Node.js SDK
      // so we need to make multiple requests
      for (const symbol of symbols) {
        const bars = await this.alpaca.getBarsV2(symbol, {
          start: start.toISOString(),
          end: end.toISOString(),
          timeframe: timeframe,
          limit: 10000,
        });

        // Convert iterator to array
        const barsArray = [];
        for await (const bar of bars) {
          barsArray.push(bar);
        }

        result[symbol] = barsArray;
      }

      return result;
    } catch (error) {
      this.logger.error(`Error fetching multiple stock bars:`, error);
      throw error;
    }
  }

  /**
   * Get options data for a symbol
   */
  async getOptionData(symbol: string, date?: string) {
    try {
      // The Alpaca Node.js SDK doesn't have direct options API support
      // We'll use the REST API directly via the SDK's httpRequest method
      const options = date
        ? await this.alpaca.getOptionChain(symbol, { expiration: date })
        : await this.alpaca.getOptionChain(symbol, {});

      return options;
    } catch (error) {
      this.logger.error(`Error fetching option data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get option chain for a symbol and expiration date
   */
  async getOptionChain(symbol: string, expiration: string) {
    try {
      const options = await this.alpaca.getOptionChain(symbol, { expiration });
      return options;
    } catch (error) {
      this.logger.error(`Error fetching option chain for ${symbol}:`, error);
      throw error;
    }
  }
}
