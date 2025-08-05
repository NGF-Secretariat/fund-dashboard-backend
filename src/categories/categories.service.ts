import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCategory } from './account-categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(AccountCategory)
    private categoriesRepository: Repository<AccountCategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Check if category with name already exists
      const existingCategory = await this.categoriesRepository.findOneBy({ 
        name: createCategoryDto.name 
      });
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }

      const category = this.categoriesRepository.create(createCategoryDto);
      const savedCategory = await this.categoriesRepository.save(category);
      return { success: true, data: savedCategory };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create category, check the input submitted, either the name does not align with the enum');
    }
  }

  async findAll() {
    try {
      const categories = await this.categoriesRepository.find({
        order: { name: 'ASC' }
      });
      return { success: true, data: categories };
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return { success: true, data: category };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch category');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Check if name is being updated and if it conflicts with existing category
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        const existingCategory = await this.categoriesRepository.findOneBy({ 
          name: updateCategoryDto.name 
        });
        if (existingCategory) {
          throw new ConflictException('Category with this name already exists');
        }
      }

      await this.categoriesRepository.update(id, updateCategoryDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update category check the input submitted, either the name does not align with the enum');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      
      await this.categoriesRepository.remove(category);
      return { success: true, data: category };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete category');
    }
  }
}
