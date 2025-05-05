import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { TimeframeEnum } from './stock-bar.entity';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stock symbols' })
  async getAllSymbols() {
    return this.stockService.getAllSymbols();
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get stock data for a specific symbol' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL)' })
  @ApiQuery({ name: 'timeframe', enum: TimeframeEnum, required: false })
  @ApiQuery({ name: 'start', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'end', required: false, description: 'End date (ISO format)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of records to return' })
  async getStockData(
    @Param('symbol') symbol: string,
    @Query('timeframe') timeframe?: TimeframeEnum,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('limit') limit?: number,
  ) {
    return this.stockService.getStockData(
      symbol,
      timeframe,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
      limit ? Number(limit) : undefined,
    );
  }
}
