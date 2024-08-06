import { IsString } from 'class-validator';

export class CreateMedicationStorageDto {
  @IsString()
  stickerCode: string;

  @IsString()
  description: string;
}
