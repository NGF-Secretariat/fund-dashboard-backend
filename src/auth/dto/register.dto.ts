import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'user', 'acct', 'audit'])
  role: 'admin' | 'user' | 'acct' | 'audit' = 'user';
} 