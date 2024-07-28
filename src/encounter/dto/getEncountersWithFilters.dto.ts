import {
    IsBoolean,
    isBoolean,
    IsDateString,
    IsEnum, IsNumber, IsOptional, IsString,
} from 'class-validator';
import {
    ChiefComplaint, Gender, MethodIn, MethodOut, PatientType,
    TriageCategory,
} from '@prisma/client';

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
    methodIn?: MethodIn

    @IsNumber()
    @IsOptional()
    ambulanceInId?: number

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender

    @IsEnum(PatientType)
    @IsOptional()
    patientType?: PatientType

    @IsEnum(TriageCategory)
    @IsOptional()
    triage?: TriageCategory

    @IsEnum(ChiefComplaint)
    @IsOptional()
    chiefComplaint?: ChiefComplaint

    @IsEnum(MethodOut)
    @IsOptional()
    methodOut?: MethodOut

    @IsNumber()
    @IsOptional()
    ambulanceOutId?: number

    @IsNumber()
    @IsOptional()
    hospitalOutId?: number

    @IsNumber()
    @IsOptional()
    aidPostId?: number

    @IsBoolean()
    @IsOptional()
    hasAttachments?: boolean

    @IsBoolean()
    @IsOptional()
    hasParameters?: boolean
}
