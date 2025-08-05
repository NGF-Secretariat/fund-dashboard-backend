import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Bank } from 'src/banks/bank.entity';
import { Currency } from 'src/currencies/currencies.entity';
import { AccountCategory } from 'src/categories/account-categories.entity';
import { Account } from 'src/accounts/account.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { AuditLog } from 'src/audit-logs/audit-logs.entity';

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_CONNECTION_URL,
  synchronize: false, // Only for migrations
  entities: [User, Bank, Currency, AccountCategory, Account, Transaction, AuditLog],
  migrations: ['src/database/migrations/*.ts'],
});
