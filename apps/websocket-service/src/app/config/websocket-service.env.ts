import {
  IsOptional,
  IsString,
} from 'class-validator';

export class WebsocketServiceEnv {
  @IsString()
  @IsOptional()
  NODE_ENV: string;
}
