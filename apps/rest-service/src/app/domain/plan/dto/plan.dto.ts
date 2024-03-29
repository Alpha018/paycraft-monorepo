import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPlanByServerDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}
