import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimeUnit } from '@prisma/client'

export class CreatePlanDto {
  @IsNumber()
  @IsPositive()
  serverReference: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  expireTime: number;

  @IsString()
  @IsEnum(TimeUnit)
  expireUnit: TimeUnit;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CommandListDto)
  executeCommands: CommandListDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandListDto)
  expiredCommands: CommandListDto[];

  @IsString()
  @IsNotEmpty()
  firebaseUid: string;
}

export class CommandListDto {
  @IsString()
  command: string;

  @IsBoolean()
  requiredOnline: boolean;
}

export class UpdatePlanDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  firebaseUid: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsNumber()
  @IsPositive()
  expireTime: number;

  @IsString()
  @IsEnum(TimeUnit)
  expireUnit: TimeUnit;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandListDto)
  executeCommands?: CommandListDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandListDto)
  expiredCommands?: CommandListDto[];
}

export class GetPlansUser {
  @IsNumber()
  @IsPositive()
  serverReference: number;

  @IsString()
  @IsNotEmpty()
  firebaseUid: string;
}

export class GetPlansByUser {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  firebaseUid: string;
}
