import {
    IsBoolean, IsOptional, IsString
} from 'class-validator';

export class NewFeedbackDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsBoolean()
    urgent: boolean;

    @IsString()
    description: string;
}
