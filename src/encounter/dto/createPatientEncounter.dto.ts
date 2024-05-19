import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
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

export class CreatePatientEncounterDto {
  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsString()
  @IsNotEmpty()
  rfid: string;

  @IsDateString()
  @IsNotEmpty()
  timeIn: string;

  @IsEnum(MethodIn)
  methodIn: MethodIn;

  @IsOptional()
  @IsNumber()
  ambulanceInId?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsEnum(PatientType)
  @IsOptional()
  patientType?: PatientType;

  @IsOptional()
  @IsEnum(TriageCategory)
  triage?: TriageCategory;

  @IsOptional()
  @IsEnum(ChiefComplaint)
  chiefComplaint?: ChiefComplaint;

  @IsDateString()
  @IsOptional()
  timeOut?: string;

  @IsEnum(MethodOut)
  @IsOptional()
  methodOut?: MethodOut;

  @IsOptional()
  @IsNumber()
  ambulanceOutId?: number;

  @IsOptional()
  @IsNumber()
  hospitalOutId?: number;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];
}
