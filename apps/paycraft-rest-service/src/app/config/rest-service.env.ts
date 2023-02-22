import {
  IsOptional,
  IsString,
} from 'class-validator';

export class RestServiceEnv {
  @IsString()
  @IsOptional()
  NODE_ENV: string;
}
