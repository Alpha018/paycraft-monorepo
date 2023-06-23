import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GrpcServiceEnv {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsString()
  @IsOptional()
  APPLICATION_NAME: string;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  SERVICE_ACCOUNT: string;

  @IsString()
  @IsNotEmpty()
  CORE_SERVICE_GRPC: string;
}
