import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Account } from 'src/accounts/account.entity';
import { User } from 'src/users/user.entity';
import { AuditLog } from 'src/audit-logs/audit-logs.entity';
import { AuditService } from 'src/common/services/audit.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, AuditService],
  imports: [TypeOrmModule.forFeature([Transaction, Account, User, AuditLog])],
})
export class TransactionsModule {}
