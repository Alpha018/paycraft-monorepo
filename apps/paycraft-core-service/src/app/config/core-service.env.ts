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

  @IsString()
  @IsNotEmpty()
  CONTENTFUL_MANAGE_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  CONTENTFUL_SPACE_ID: string;

  @IsString()
  @IsNotEmpty()
  CONTENTFUL_ENVIRONMENT_ID: string;
}
