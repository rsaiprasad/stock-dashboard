import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { OptionDataEntity } from './option-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionDataEntity])],
  providers: [OptionService],
  controllers: [OptionController],
  exports: [OptionService],
})
export class OptionModule {}
