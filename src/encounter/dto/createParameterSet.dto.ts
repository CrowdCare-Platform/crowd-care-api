import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { WAPA } from '@prisma/client';

export class CreateParameterSetDto {
  @IsEnum(WAPA)
  @IsOptional()
  WAPA?: WAPA;

  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  saturation?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @IsNumber()
  @IsOptional()
  bloodPressureSystolic?: number;

  @IsNumber()
  @IsOptional()
  bloodPressureDiastolic?: number;

  @IsNumber()
  @IsOptional()
  glucoseLevel?: number;
}
