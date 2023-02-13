import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CoreServiceEnv {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsString()
  @IsOptional()
  APPLICATION_NAME;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}
