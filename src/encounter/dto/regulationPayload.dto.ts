import {
  IsDateString,
  IsEnum, IsNumber, IsOptional
} from 'class-validator';
import {
  MethodOut
} from '@prisma/client';

export class RegulationPayloadDto {
  @IsEnum(MethodOut)
  methodOut: MethodOut

  @IsNumber()
  @IsOptional()
  ambulanceOutId?: number

  @IsDateString()
  timeOut: string;
}
