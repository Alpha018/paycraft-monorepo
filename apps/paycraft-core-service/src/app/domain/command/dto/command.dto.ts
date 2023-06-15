import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CommandStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class pendingTransactionDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @IsOptional()
  @IsString()
  serverToken: string;
}

export class changeCommandDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsEnum(CommandStatus)
  @IsString()
  @IsOptional()
  status: CommandStatus
}

export class expireDateDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  expireDate: Date
}
