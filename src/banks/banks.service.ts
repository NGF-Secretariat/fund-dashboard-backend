import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto) {    
    try {
      // Check if bank with name already exists
      const existingBank = await this.banksRepository.findOneBy({ name: createBankDto.name });
      if (existingBank) {
        throw new ConflictException('Bank with this name already exists');
      }

      const bank = this.banksRepository.create(createBankDto);
      const savedBank = await this.banksRepository.save(bank);
      return { success: true, data: savedBank };
    } catch (error) {
        console.log(error);
        
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create bank');
    }
  }

  async findAll() {
    try {
      const banks = await this.banksRepository.find({
        order: { name: 'ASC' }
      });
      return { success: true, data: banks };
    } catch (error) {
      throw new Error('Failed to fetch banks');
    }
  }

  async findOne(id: number) {
    try {
      const bank = await this.banksRepository.findOneBy({ id });
      if (!bank) {
        throw new NotFoundException(`Bank with ID ${id} not found`);
      }
      return { success: true, data: bank };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch bank');
    }
  }

  async update(id: number, updateBankDto: UpdateBankDto) {
    try {
      const bank = await this.banksRepository.findOneBy({ id });
      if (!bank) {
        throw new NotFoundException(`Bank with ID ${id} not found`);
      }

      // Check if name is being updated and if it conflicts with existing bank
      if (updateBankDto.name && updateBankDto.name !== bank.name) {
        const existingBank = await this.banksRepository.findOneBy({ name: updateBankDto.name });
        if (existingBank) {
          throw new ConflictException('Bank with this name already exists');
        }
      }

      await this.banksRepository.update(id, updateBankDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update bank');
    }
  }

  async remove(id: number) {
    try {
      const bank = await this.banksRepository.findOneBy({ id });
      if (!bank) {
        throw new NotFoundException(`Bank with ID ${id} not found`);
      }
      
      await this.banksRepository.remove(bank);
      return { success: true, data: bank };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete bank');
    }
  }
}
