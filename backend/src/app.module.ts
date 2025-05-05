import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { OptionModule } from './option/option.module';
import { FilterModule } from './filter/filter.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { AlpacaModule } from './alpaca/alpaca.module';
import { StockBarEntity } from './stock/stock-bar.entity';
import { OptionDataEntity } from './option/option-data.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'mysql'),
        port: configService.get('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USERNAME', 'user'),
        password: configService.get('DATABASE_PASSWORD', 'password'),
        database: configService.get('DATABASE_NAME', 'stock_dashboard'),
        entities: [StockBarEntity, OptionDataEntity],
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
        logging: configService.get('NODE_ENV', 'development') !== 'production',
      }),
    }),
    ScheduleModule.forRoot(),
    StockModule,
    OptionModule,
    FilterModule,
    DataSyncModule,
    AlpacaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
