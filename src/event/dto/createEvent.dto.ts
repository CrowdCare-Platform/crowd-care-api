// createTenant Dto
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
