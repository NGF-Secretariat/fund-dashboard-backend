import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class ResetPasswordDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

} 