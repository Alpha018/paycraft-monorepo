import {
  IsEnum,
  IsNotEmpty, IsNumber, IsObject,
  IsOptional, IsPositive,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class TransactionDto {
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
  tokenWs: string;

  @IsOptional()
  @IsString()
  tbkToken: string;
}

export class BigCommerceTransaction {
  @IsNotEmpty()
  @IsObject()
  rawData: unknown;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNumber()
  @IsPositive()
  planId: number;

  @IsNumber()
  @IsPositive()
  serverId: number;
}

export class TransactionUpdateExecuted {
  @IsNotEmpty()
  @IsString()
  id: string;
}
