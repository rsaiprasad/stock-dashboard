import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionDataEntity } from './option-data.entity';

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);

  constructor(
    @InjectRepository(OptionDataEntity)
    private optionDataRepository: Repository<OptionDataEntity>,
  ) {}

  /**
   * Get all unique option symbols in the database
   */
  async getAllSymbols(): Promise<string[]> {
    try {
      const result = await this.optionDataRepository
        .createQueryBuilder('option')
        .select('DISTINCT option.symbol', 'symbol')
        .getRawMany();

      return result.map((item) => item.symbol);
    } catch (error) {
      this.logger.error(`Error getting all option symbols: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get option data for a specific symbol with optional filters
   */
  async getOptionData(
    symbol: string,
    expiration?: Date,
    type?: 'call' | 'put',
  ): Promise<OptionDataEntity[]> {
    try {
      const queryBuilder = this.optionDataRepository
        .createQueryBuilder('option')
        .where('option.symbol = :symbol', { symbol });

      if (expiration) {
        queryBuilder.andWhere('option.expiration_date = :expiration', { expiration });
      }

      if (type) {
        queryBuilder.andWhere('option.option_type = :type', { type });
      }

      queryBuilder
        .orderBy('option.expiration_date', 'ASC')
        .addOrderBy('option.strike_price', 'ASC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Error getting option data for ${symbol}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get available expiration dates for a symbol
   */
  async getExpirationDates(symbol: string): Promise<Date[]> {
    try {
      const result = await this.optionDataRepository
        .createQueryBuilder('option')
        .select('DISTINCT option.expiration_date', 'expiration_date')
        .where('option.symbol = :symbol', { symbol })
        .orderBy('option.expiration_date', 'ASC')
        .getRawMany();

      return result.map((item) => item.expiration_date);
    } catch (error) {
      this.logger.error(
        `Error getting expiration dates for ${symbol}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
