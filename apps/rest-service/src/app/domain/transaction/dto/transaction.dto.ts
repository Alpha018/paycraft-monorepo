import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class InitTransactionDto {
  @IsNumber()
  @IsPositive()
  planId: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payMethod: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNumber()
  @IsPositive()
  serverId: number;
}

export class TransactionResultDto {
  @IsOptional()
  @IsString()
  token_ws = '';

  @IsOptional()
  @IsString()
  TBK_TOKEN = '';
}
