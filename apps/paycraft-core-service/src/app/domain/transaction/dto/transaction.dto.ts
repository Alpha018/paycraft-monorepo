import {
  IsEnum,
  IsNotEmpty, IsNumber,
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

export class TransactionUpdateExecuted {
  @IsNotEmpty()
  @IsString()
  id: string;
}
