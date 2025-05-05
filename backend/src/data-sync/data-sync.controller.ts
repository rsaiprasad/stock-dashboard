import { Body, Controller, Post, Get } from '@nestjs/common';
import { DataSyncService } from './data-sync.service';
import { TimeframeEnum } from '../stock/stock-bar.entity';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('data-sync')
@Controller('data-sync')
export class DataSyncController {
  constructor(private readonly dataSyncService: DataSyncService) {}

  @Post('stock')
  @ApiOperation({ summary: 'Fetch and store historical stock data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', example: 'AAPL' },
        timeframe: { type: 'string', enum: Object.values(TimeframeEnum), example: '1Day' },
        startDate: { type: 'string', example: '2023-01-01' },
        endDate: { type: 'string', example: '2023-12-31' },
      },
      required: ['symbol', 'timeframe', 'startDate'],
    },
  })
  async fetchStockData(
    @Body()
    fetchParams: {
      symbol: string;
      timeframe: TimeframeEnum;
      startDate: string;
      endDate?: string;
    },
  ) {
    const { symbol, timeframe, startDate, endDate } = fetchParams;
    return this.dataSyncService.fetchHistoricalStockData(
      symbol,
      timeframe,
      new Date(startDate),
      endDate ? new Date(endDate) : new Date(),
    );
  }

  @Post('options')
  @ApiOperation({ summary: 'Fetch and store options data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', example: 'AAPL' },
        expirationDate: { type: 'string', example: '2023-12-15' },
        strikePrice: { type: 'number', example: 150 },
        optionType: { type: 'string', enum: ['call', 'put'], example: 'call' },
      },
      required: ['symbol'],
    },
  })
  async fetchOptionsData(
    @Body()
    fetchParams: {
      symbol: string;
      expirationDate?: string;
      strikePrice?: number;
      optionType?: 'call' | 'put';
    },
  ) {
    const { symbol, expirationDate, strikePrice, optionType } = fetchParams;
    return this.dataSyncService.fetchOptionsData(symbol, expirationDate, strikePrice, optionType);
  }

  @Get('sync-status')
  @ApiOperation({ summary: 'Get the status of the last sync operation' })
  async getSyncStatus() {
    return this.dataSyncService.getSyncStatus();
  }

  @Post('sync-historical')
  @ApiOperation({ summary: 'Trigger a historical data sync for a symbol' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', example: 'AAPL' },
        years: { type: 'number', example: 5 },
      },
      required: ['symbol'],
    },
  })
  async syncHistoricalData(@Body() syncParams: { symbol: string; years?: number }) {
    const { symbol, years = 5 } = syncParams;
    return this.dataSyncService.syncHistoricalDataForSymbol(symbol, years);
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Trigger a full data sync for all configured symbols' })
  async syncAllData() {
    return this.dataSyncService.syncAllData();
  }
}
