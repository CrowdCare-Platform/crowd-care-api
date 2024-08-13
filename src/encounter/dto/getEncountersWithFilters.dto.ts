import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ChiefComplaint,
  Gender,
  MethodIn,
  MethodOut,
  PatientType,
  TriageCategory,
} from '@prisma/client';
import { Type } from 'class-transformer';

export class GetEncountersWithFiltersDto {
  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsString()
  @IsOptional()
  rfid?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(MethodIn)
  @IsOptional()
  methodIn?: MethodIn;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ambulanceInId?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(PatientType)
  @IsOptional()
  patientType?: PatientType;

  @IsEnum(TriageCategory)
  @IsOptional()
  triage?: TriageCategory;

  @IsEnum(ChiefComplaint)
  @IsOptional()
  chiefComplaint?: ChiefComplaint;

  @IsEnum(MethodOut)
  @IsOptional()
  methodOut?: MethodOut;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ambulanceOutId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  hospitalOutId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  aidPostId?: number;

  @IsString()
  @IsOptional()
  active?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;
}
