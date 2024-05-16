// createTenant Dto
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAmbulanceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  comment: string;

  @IsNumber()
  order: number;
}
