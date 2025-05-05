import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockBarEntity, TimeframeEnum } from './stock-bar.entity';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(StockBarEntity)
    private stockBarRepository: Repository<StockBarEntity>,
  ) {}

  /**
   * Get all unique stock symbols in the database
   */
  async getAllSymbols(): Promise<string[]> {
    try {
      const result = await this.stockBarRepository
        .createQueryBuilder('stock')
        .select('DISTINCT stock.symbol', 'symbol')
        .getRawMany();

      return result.map((item) => item.symbol);
    } catch (error) {
      this.logger.error(`Error getting all symbols: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get stock data for a specific symbol with optional filters
   */
  async getStockData(
    symbol: string,
    timeframe?: TimeframeEnum,
    start?: Date,
    end?: Date,
    limit?: number,
  ): Promise<StockBarEntity[]> {
    try {
      const queryBuilder = this.stockBarRepository
        .createQueryBuilder('stock')
        .where('stock.symbol = :symbol', { symbol });

      if (timeframe) {
        queryBuilder.andWhere('stock.timeframe = :timeframe', { timeframe });
      }

      if (start) {
        queryBuilder.andWhere('stock.timestamp >= :start', { start });
      }

      if (end) {
        queryBuilder.andWhere('stock.timestamp <= :end', { end });
      }

      queryBuilder.orderBy('stock.timestamp', 'DESC');

      if (limit) {
        queryBuilder.limit(limit);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Error getting stock data for ${symbol}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
