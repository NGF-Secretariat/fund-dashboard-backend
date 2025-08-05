import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsNumber()
  bankId: number;

  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @IsNumber()
  categoryId: number;

} 