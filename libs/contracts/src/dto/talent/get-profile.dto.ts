import { IsString } from 'class-validator';

export class GetProfileDto {
  @IsString()
  talent_id!: string;
}