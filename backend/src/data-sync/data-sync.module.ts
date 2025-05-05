import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSyncService } from './data-sync.service';
import { DataSyncController } from './data-sync.controller';
import { StockBarEntity } from '../stock/stock-bar.entity';
import { OptionDataEntity } from '../option/option-data.entity';
import { AlpacaModule } from '../alpaca/alpaca.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockBarEntity, OptionDataEntity]),
    AlpacaModule,
    ConfigModule,
  ],
  providers: [DataSyncService],
  controllers: [DataSyncController],
  exports: [DataSyncService],
})
export class DataSyncModule {}
