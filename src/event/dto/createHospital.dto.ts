// createTenant Dto
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  comment: string;

  @IsNumber()
  order: number;
}
