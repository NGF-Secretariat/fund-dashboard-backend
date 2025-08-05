import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuditService } from '../common/services/audit.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private auditService: AuditService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    // Find the account
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.accountId },
      relations: ['currency', 'bank'],
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${createTransactionDto.accountId} not found`);
    }

    // Calculate new balance
    const previousBalance = Number(account.balance);
    let amountDto = Number(createTransactionDto.amount);
    let currentBalance: number;

    if (createTransactionDto.type === 'inflow') {
      currentBalance = previousBalance + amountDto;
    } else {
      if (previousBalance < amountDto) {
        throw new BadRequestException('Insufficient balance for outflow transaction');
      }
      currentBalance = previousBalance - amountDto;
    }

    // Create transaction
    const transaction = this.transactionsRepository.create({
      account,
      type: createTransactionDto.type,
      amount: amountDto,
      previousBalance,
      currentBalance,
      description: createTransactionDto.description,
      createdBy: user,
    });

    const savedTransaction = await this.transactionsRepository.save(transaction);

    // Update account balance
    account.balance = currentBalance;
    await this.accountRepository.save(account);

    // Log audit
    await this.auditService.logCreate(
      'transaction',
      savedTransaction.id,
      `Created ${createTransactionDto.type} transaction of ${createTransactionDto.amount} for account ${account.name}`,
      user
    );

    return {
      success: true,
      data: {
        ...savedTransaction,
        account: {
          id: account.id,
          name: account.name,
          currency: account.currency,
          bank: { id: account.bank.id, name: account.bank.name },
        },
      },
    };
  }

  async findAll(options?: { startDate?: string; endDate?: string; limit?: number; page?: number }) {
    const query = this.transactionsRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('account.currency', 'currency')
      .leftJoinAndSelect('account.bank', 'bank')
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .orderBy('transaction.createdAt', 'DESC');

    if (options?.startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options?.endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate: options.endDate });
    }
    let limit = options?.limit || 50;
    let page = options?.page || 1;
    query.take(limit);
    query.skip((page - 1) * limit);

    const transactions = await query.getMany();

    // Map transactions to include bank name in account
    const data = transactions.map(t => ({
      ...t,
      account: {
        id: t.account.id,
        name: t.account.name,
        currency: t.account.currency,
        bank: t.account.bank ? { id: t.account.bank.id, name: t.account.bank.name } : null,
      },
    }));

    return {
      success: true,
      data,
    };
  }

  async findOne(id: number) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['account', 'account.currency', 'account.bank', 'createdBy'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      success: true,
      data: {
        ...transaction,
        account: {
          id: transaction.account.id,
          name: transaction.account.name,
          currency: transaction.account.currency,
          bank: transaction.account.bank ? { id: transaction.account.bank.id, name: transaction.account.bank.name } : null,
        },
      },
    };
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto, user: User) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Store old values for audit
    const oldValues = {
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
    };

    // Update transaction
    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionsRepository.save(transaction);

    // Log audit for each changed field
    for (const [field, oldValue] of Object.entries(oldValues)) {
      if (oldValue !== updatedTransaction[field]) {
        await this.auditService.logUpdate(
          'transaction',
          id,
          field,
          String(oldValue),
          String(updatedTransaction[field]),
          `Updated transaction ${field} from ${oldValue} to ${updatedTransaction[field]}`,
          user
        );
      }
    }

    return {
      success: true,
      data: updatedTransaction,
    };
  }

  async remove(id: number, user: User) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Log audit before deletion
    await this.auditService.logDelete(
      'transaction',
      id,
      `Deleted ${transaction.type} transaction of ${transaction.amount} for account ${transaction.account.name}`,
      user
    );

    await this.transactionsRepository.remove(transaction);

    return {
      success: true,
      message: 'Transaction deleted successfully',
    };
  }
}
