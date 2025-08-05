import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/account.entity';
import { AccountCategory } from 'src/categories/account-categories.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
    imports: [TypeOrmModule.forFeature([Account, AccountCategory])],

})
export class DashboardModule {}
