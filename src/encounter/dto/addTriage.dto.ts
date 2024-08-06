import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ChiefComplaint, TriageCategory } from '@prisma/client';

export class AddTriageDto {
  @IsEnum(TriageCategory)
  triageCategory: TriageCategory;

  @IsEnum(ChiefComplaint)
  chiefComplaint: ChiefComplaint;

  @IsDateString()
  @IsOptional()
  timeTriage?: string;

  @IsDateString()
  @IsOptional()
  timeStartTreatment?: string;
}
