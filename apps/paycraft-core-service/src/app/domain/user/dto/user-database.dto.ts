import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';
export class UserDatabaseDto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class GetUserByIdDto {
  @IsNumber()
  @IsPositive()
  id: number;
}

export class GetUserByEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
