import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AccountCategory } from './account-categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([AccountCategory])],
})
export class CategoriesModule {}
