import { Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { Currency } from './currencies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  imports: [TypeOrmModule.forFeature([Currency])],
})
export class CurrenciesModule {}
