import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { OptionModule } from './option/option.module';
import { FilterModule } from './filter/filter.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { StockBarEntity } from './stock/stock-bar.entity';
import { OptionDataEntity } from './option/option-data.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'stock_dashboard',
      entities: [StockBarEntity, OptionDataEntity],
      synchronize: true, // Set to false in production
    }),
    StockModule,
    OptionModule,
    FilterModule,
    DataSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
