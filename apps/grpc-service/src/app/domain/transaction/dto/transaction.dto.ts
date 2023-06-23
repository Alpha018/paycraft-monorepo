import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
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
