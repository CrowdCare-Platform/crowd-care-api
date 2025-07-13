import { IsString } from 'class-validator';

export class QueryStatsParamsDto {
  @IsString()
  eventId: string;
}
