import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class RestServiceEnv {
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
  CORE_SERVICE_GRPC: string

  @IsString()
  @IsNotEmpty()
  SERVICE_ACCOUNT: string
}
