import { IsEmail, IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['user', 'acct', 'audit'])
  role: 'user' | 'acct' | 'audit';
} 