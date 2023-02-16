import { IsIP, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class CreateServerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsIP()
  ip: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  logoUrl: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  pageUrl: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  successPaymentUrl: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  failPaymentUrl: string;

  @IsNumber()
  @IsPositive()
  adminId: number;
}

export class ServerUserQuery {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  firebaseUid?: string;
}

export class ServerQuery {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  serverToken?: string;
}
