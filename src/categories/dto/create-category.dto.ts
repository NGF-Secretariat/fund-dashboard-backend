import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsEnum(['secretariat', 'project'])
  @IsNotEmpty()
  name: 'secretariat' | 'project';
} 