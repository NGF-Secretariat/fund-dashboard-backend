import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/account.entity';
import { AccountCategory } from 'src/categories/account-categories.entity';
import { Transaction } from 'src/transactions/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(AccountCategory)
    private readonly categoryRepo: Repository<AccountCategory>,
  ) {}

  async getTestService() {
    return "okay operation completed successfully";
}


  async getAccountsGroupedByCurrency(bankId: number, category: 'project' | 'secretariat') {
    const categoryEntity = await this.categoryRepo.findOne({ where: { name: category } });

    if (!categoryEntity) {
      throw new Error(`Category '${category}' not found`);
    }

    const accounts = await this.accountRepo.find({
      where: {
        bank: { id: bankId },
        category: { id: categoryEntity.id },
      },
      relations: ['currency', 'bank', 'category'],
    });

    // Simulated balance logic — replace with actual queries
    const result = {};

    for (const account of accounts) {
      const currency = account.currency.code;

      const summary = {
        id: account.id,
        name: account.name,
        accountNumber: account.accountNumber,
        previousBalance: 0,
        inflow: 0,
        outflow: 0,
        currentBalance: 0,
      };

      if (!result[currency]) result[currency] = [];
      result[currency].push(summary);
    }

    return result;
  }

  /**
   * Aggregates all accounts grouped by category (secretariat/project), then by bank, then by currency.
   * Returns an object: { secretariat: { [bankName]: { [currencyCode]: [accounts] } }, project: { ... } }
   */
  async getAllAccountsGrouped() {
    // Fetch all accounts with relations
    const accounts = await this.accountRepo.find({
      relations: ['bank', 'currency', 'category', 'transactions'],
    });

    // Prepare the result structure
    const result: Record<string, Record<string, Record<string, any[]>>> = {};

    for (const account of accounts) {
      const category = account.category?.name;
      const bank = account.bank?.name;
      const currency = account.currency?.code;
      if (!category || !bank || !currency) continue;

      // Calculate inflow, outflow, previousBalance, currentBalance
      let inflow = 0;
      let outflow = 0;
      let previousBalance = account.balance;
      let currentBalance = account.balance;
      let transactions = account.transactions || [];
      if (transactions.length > 0) {
        // Sort by createdAt ascending
        transactions = transactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        inflow = transactions.filter(t => t.type === 'inflow').reduce((sum, t) => sum + Number(t.amount), 0);
        outflow = transactions.filter(t => t.type === 'outflow').reduce((sum, t) => sum + Number(t.amount), 0);
        previousBalance = Number(transactions[0].previousBalance);
        currentBalance = Number(transactions[transactions.length - 1].currentBalance);
      } else {
        inflow = 0;
        outflow = 0;
        previousBalance = Number(account.balance);
        currentBalance = Number(account.balance);
      }

      if (!result[category]) result[category] = {};
      if (!result[category][bank]) result[category][bank] = {};
      if (!result[category][bank][currency]) result[category][bank][currency] = [];

      result[category][bank][currency].push({
        id: account.id,
        name: account.name,
        accountNumber: account.accountNumber,
        previousBalance,
        inflow,
        outflow,
        currentBalance,
      });
    }

    return result;
  }

  /**
   * Returns grouped accounts for a specific category (project or secretariat)
   */
  async getAccountsGroupedByCategory(category: 'project' | 'secretariat') {
    const all = await this.getAllAccountsGrouped();
    return { [category]: all[category] || {} };
  }
}
