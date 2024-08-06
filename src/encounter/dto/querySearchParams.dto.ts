import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TriageCategory } from '@prisma/client';

export class QuerySearchParamsDto {
  @IsString()
  eventId: string;

  @IsString()
  aidPostId: string;

  @IsString()
  @IsOptional()
  rfid?: string;

  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsOptional()
  @IsEnum(TriageCategory)
  triage?: TriageCategory;
}
