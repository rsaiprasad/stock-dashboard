import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlpacaService } from './alpaca.service';

@Module({
  imports: [ConfigModule],
  providers: [AlpacaService],
  exports: [AlpacaService],
})
export class AlpacaModule {}
