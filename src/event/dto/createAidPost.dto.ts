import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAidPostDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
