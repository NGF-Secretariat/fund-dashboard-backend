import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currencies.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    try {
      
      // Check if currency with code already exists
      const existingCurrency = await this.currenciesRepository.findOneBy({ 
        code: createCurrencyDto.code 
      });
      if (existingCurrency) {
        throw new ConflictException('Currency with this code already exists');
      }

      // Check if currency with name already exists
      const existingCurrencyByName = await this.currenciesRepository.findOneBy({ 
        name: createCurrencyDto.name 
      });
      if (existingCurrencyByName) {
        throw new ConflictException('Currency with this name already exists');
      }

      const currency = this.currenciesRepository.create(createCurrencyDto);
      
      const savedCurrency = await this.currenciesRepository.save(currency);
      
      return { success: true, data: savedCurrency };
    } catch (error) {
      console.error('Error creating currency:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create currency');
    }
  }

  async findAll() {
    try {
      const currencies = await this.currenciesRepository.find({
        order: { code: 'ASC' }
      });
      return { success: true, data: currencies };
    } catch (error) {
      throw new Error('Failed to fetch currencies');
    }
  }

  async findOne(id: number) {
    try {
      const currency = await this.currenciesRepository.findOneBy({ id });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found`);
      }
      return { success: true, data: currency };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch currency');
    }
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      const currency = await this.currenciesRepository.findOneBy({ id });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found`);
      }
  
      // ✅ Validate unique code if attempting to update
      if (
        updateCurrencyDto.code &&
        updateCurrencyDto.code !== currency.code
      ) {
        const existingCode = await this.currenciesRepository.findOneBy({ code: updateCurrencyDto.code });
        if (existingCode) {
          throw new ConflictException('Currency with this code already exists');
        }
      }
  
      // ✅ Validate unique name if attempting to update
      if (
        updateCurrencyDto.name &&
        updateCurrencyDto.name !== currency.name
      ) {
        const existingName = await this.currenciesRepository.findOneBy({ name: updateCurrencyDto.name });
        if (existingName) {
          throw new ConflictException('Currency with this name already exists');
        }
      }
  
      await this.currenciesRepository.update({ id }, updateCurrencyDto);
      return await this.findOne(id);
  
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update currency');
    }
  }
  

  async remove(id: number) {
    try {
      const currency = await this.currenciesRepository.findOneBy({ id });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found`);
      }
      
      await this.currenciesRepository.remove(currency);
      return { success: true, data: currency };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete currency');
    }
  }
}
