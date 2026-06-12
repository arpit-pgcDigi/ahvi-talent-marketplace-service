import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AvailabilityStatus, WorkModel } from '@prisma/client';

export class CreateProfileDto {
  @IsString()
  user_id!: string; // injected by gateway from JWT — never sent by client

  @ApiProperty({
    example: 'John Doe',
    description: 'Full legal name of the talent',
  })
  @IsString()
  full_name!: string;

  @ApiPropertyOptional({
    example: 'Senior Backend Engineer',
    description: 'Professional headline shown on the marketplace',
  })
  @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Experienced Node.js engineer focused on microservices.',
    description: 'Short professional bio',
  })
  @IsOptional() @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'IN', description: 'ISO 3166-1 alpha-2 country code' })
  @IsOptional() @IsString()
  country_code?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsOptional() @IsString()
  location_city?: string;

  @ApiPropertyOptional({ example: 5, minimum: 0, maximum: 50 })
  @IsOptional() @IsInt() @Min(0) @Max(50)
  years_experience?: number;

  @ApiPropertyOptional({ enum: AvailabilityStatus, example: 'IMMEDIATE' })
  @IsOptional() @IsEnum(AvailabilityStatus)
  availability?: AvailabilityStatus;

  @ApiPropertyOptional({ enum: WorkModel, example: 'REMOTE' })
  @IsOptional() @IsEnum(WorkModel)
  work_model?: WorkModel;

  @ApiPropertyOptional({ example: 'Asia/Kolkata' })
  @IsOptional() @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' })
  @IsOptional() @IsUrl()
  linkedin_url?: string;

  @ApiPropertyOptional({ example: 'https://github.com/johndoe' })
  @IsOptional() @IsUrl()
  github_url?: string;
}