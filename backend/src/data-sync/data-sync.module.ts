import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSyncService } from './data-sync.service';
import { StockBarEntity } from '../stock/stock-bar.entity';
import { OptionDataEntity } from '../option/option-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockBarEntity, OptionDataEntity])],
  providers: [DataSyncService],
  exports: [DataSyncService],
})
export class DataSyncModule {}
