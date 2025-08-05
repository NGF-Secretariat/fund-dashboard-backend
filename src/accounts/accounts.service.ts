import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Bank } from '../banks/bank.entity';
import { Currency } from '../currencies/currencies.entity';
import { AccountCategory } from '../categories/account-categories.entity';
import { User } from '../users/user.entity';
import { Multer } from 'multer';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
    @InjectRepository(AccountCategory)
    private categoriesRepository: Repository<AccountCategory>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createAccountDto: CreateAccountDto, user: User) {
    try {
      // Check if account with account number already exists
      const existingAccount = await this.accountsRepository.findOneBy({ 
        accountNumber: createAccountDto.accountNumber 
      });
      if (existingAccount) {
        throw new ConflictException('Account with this account number already exists');
      }

      // Validate bank exists
      const bank = await this.banksRepository.findOneBy({ id: createAccountDto.bankId });
      if (!bank) {
        throw new NotFoundException(`Bank with ID ${createAccountDto.bankId} not found`);
      }

      // Validate currency exists
      const currency = await this.currenciesRepository.findOneBy({ code: createAccountDto.currencyCode });
      if (!currency) {
        throw new NotFoundException(`Currency with code ${createAccountDto.currencyCode} not found`);
      }

      // Validate category exists
      const category = await this.categoriesRepository.findOneBy({ id: createAccountDto.categoryId });
      if (!category) {
        throw new NotFoundException(`Category with ID ${createAccountDto.categoryId} not found`);
      }

      const account = this.accountsRepository.create({
        name: createAccountDto.name,
        accountNumber: createAccountDto.accountNumber,
        bank: bank,
        currency: currency,
        category: category,
        createdBy: user,
      });

      const savedAccount = await this.accountsRepository.save(account);
      
      // Load relations for response
      const accountWithRelations = await this.accountsRepository.findOne({
        where: { id: savedAccount.id },
        relations: ['bank', 'currency', 'category', 'createdBy'],
      });

      return { success: true, data: accountWithRelations! };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create account');
    }
  }

  async findAll() {
    try {
      const accounts = await this.accountsRepository.find({
        relations: ['bank', 'currency', 'category', 'createdBy'],
        order: { createdAt: 'DESC' }
      });
      return { success: true, data: accounts };
    } catch (error) {
      throw new Error('Failed to fetch accounts');
    }
  }

  async findOne(id: number) {
    try {
      const account = await this.accountsRepository.findOne({
        where: { id },
        relations: ['bank', 'currency', 'category', 'createdBy'],
      });
      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }
      return { success: true, data: account };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch account');
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      const account = await this.accountsRepository.findOneBy({ id });
      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      // Check if account number is being updated and if it conflicts with existing account
      if (updateAccountDto.accountNumber && updateAccountDto.accountNumber !== account.accountNumber) {
        const existingAccount = await this.accountsRepository.findOneBy({ 
          accountNumber: updateAccountDto.accountNumber 
        });
        if (existingAccount) {
          throw new ConflictException('Account with this account number already exists');
        }
      }

      // Validate bank exists if being updated
      if (updateAccountDto.bankId) {
        const bank = await this.banksRepository.findOneBy({ id: updateAccountDto.bankId });
        if (!bank) {
          throw new NotFoundException(`Bank with ID ${updateAccountDto.bankId} not found`);
        }
      }

      // Validate currency exists if being updated
      if (updateAccountDto.currencyCode) {
        const currency = await this.currenciesRepository.findOneBy({ code: updateAccountDto.currencyCode });
        if (!currency) {
          throw new NotFoundException(`Currency with code ${updateAccountDto.currencyCode} not found`);
        }
      }

      // Validate category exists if being updated
      if (updateAccountDto.categoryId) {
        const category = await this.categoriesRepository.findOneBy({ id: updateAccountDto.categoryId });
        if (!category) {
          throw new NotFoundException(`Category with ID ${updateAccountDto.categoryId} not found`);
        }
      }


      // Prepare update data
      const updateData: any = {};
      if (updateAccountDto.name) updateData.name = updateAccountDto.name;
      if (updateAccountDto.accountNumber) updateData.accountNumber = updateAccountDto.accountNumber;
      if (updateAccountDto.bankId) {
        const bank = await this.banksRepository.findOneBy({ id: updateAccountDto.bankId });
        updateData.bank = bank;
      }
      if (updateAccountDto.currencyCode) {
        const currency = await this.currenciesRepository.findOneBy({ code: updateAccountDto.currencyCode });
        updateData.currency = currency;
      }
      if (updateAccountDto.categoryId) {
        const category = await this.categoriesRepository.findOneBy({ id: updateAccountDto.categoryId });
        updateData.category = category;
      }

      await this.accountsRepository.update(id, updateData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update account');
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accountsRepository.findOne({
        where: { id },
        relations: ['bank', 'currency', 'category', 'createdBy'],
      });
      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }
      
      await this.accountsRepository.remove(account);
      return { success: true, data: account };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete account');
    }
  }

  async bulkUploadFromExcel(file: Multer.File, user: User) {
    // TODO: Implement Excel parsing and bulk account creation
    return { success: true, message: 'Excel upload endpoint hit', filename: file.originalname };
  }
}
