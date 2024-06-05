// createTenant Dto
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
