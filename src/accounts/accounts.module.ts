import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Bank } from 'src/banks/bank.entity';
import { Currency } from 'src/currencies/currencies.entity';
import { AccountCategory } from 'src/categories/account-categories.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([Account, Bank, Currency, AccountCategory, User]),
    AuthModule,
  ],
})
export class AccountsModule {}
