import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { MethodOut } from '@prisma/client';

export class RegulationPayloadDto {
  @IsEnum(MethodOut)
  methodOut: MethodOut;

  @IsNumber()
  @IsOptional()
  ambulanceOutId?: number;

  @IsNumber()
  @IsOptional()
  hospitalOutId?: number;

  @IsDateString()
  timeOut: string;
}
