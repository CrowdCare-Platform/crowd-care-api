import { IsNumber, IsOptional, IsString } from 'class-validator';

export class NewDeviceFeedbackDto {
  @IsString()
  user: string;

  @IsNumber()
  battery: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsNumber()
  totalMemory?: number;
}
