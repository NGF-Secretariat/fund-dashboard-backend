import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { Bank } from './bank.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [BanksService],
  controllers: [BanksController],
  imports: [TypeOrmModule.forFeature([Bank])],
})
export class BanksModule {}
