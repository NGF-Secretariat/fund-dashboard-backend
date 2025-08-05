import { IsEnum, IsNumber, IsString, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  accountId: number;

  @IsEnum(['inflow', 'outflow'])
  type: 'inflow' | 'outflow';

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
} 