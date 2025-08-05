import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, { message: 'Currency code must be exactly 3 uppercase letters' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;
} 