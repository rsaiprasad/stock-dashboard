import { Controller, Get, Param, Query } from '@nestjs/common';
import { OptionService } from './option.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('options')
@Controller('options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all option symbols' })
  async getAllSymbols() {
    return this.optionService.getAllSymbols();
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get option data for a specific symbol' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL)' })
  @ApiQuery({ name: 'expiration', required: false, description: 'Expiration date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'type', required: false, enum: ['call', 'put'], description: 'Option type' })
  async getOptionData(
    @Param('symbol') symbol: string,
    @Query('expiration') expiration?: string,
    @Query('type') type?: 'call' | 'put',
  ) {
    return this.optionService.getOptionData(
      symbol,
      expiration ? new Date(expiration) : undefined,
      type,
    );
  }

  @Get(':symbol/expirations')
  @ApiOperation({ summary: 'Get available expiration dates for a symbol' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL)' })
  async getExpirationDates(@Param('symbol') symbol: string) {
    return this.optionService.getExpirationDates(symbol);
  }
}
