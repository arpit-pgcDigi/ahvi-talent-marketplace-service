import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AvailabilityStatus, WorkModel } from '@prisma/client';

export class CreateProfileDto {
  @IsString()
  user_id!: string;

  @IsString()
  full_name!: string;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  bio?: string;

  @IsOptional() @IsString()
  country_code?: string;

  @IsOptional() @IsString()
  location_city?: string;

  @IsOptional() @IsInt() @Min(0) @Max(50)
  years_experience?: number;

  @IsOptional() @IsEnum(AvailabilityStatus)
  availability?: AvailabilityStatus;

  @IsOptional() @IsEnum(WorkModel)
  work_model?: WorkModel;

  @IsOptional() @IsString()
  timezone?: string;

  @IsOptional() @IsUrl()
  linkedin_url?: string;

  @IsOptional() @IsUrl()
  github_url?: string;
}

export class GetProfileDto {
  @IsString()
  talent_id!: string;
}