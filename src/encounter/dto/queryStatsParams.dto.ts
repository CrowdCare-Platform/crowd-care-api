import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import { TriageCategory } from '@prisma/client';

export class QueryStatsParamsDto {
  @IsString()
  eventId: string;
}
