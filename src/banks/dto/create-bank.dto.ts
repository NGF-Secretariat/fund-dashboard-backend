import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;
} 