import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AvailabilityStatus, WorkModel, SkillType } from '@prisma/client';

// ── Create Profile ───────────────────────────────────────────────────────────
export class CreateProfileDto {
  @IsString()
  user_id!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full legal name of the talent' })
  @IsString()
  full_name!: string;

  @ApiPropertyOptional({ example: 'Senior Backend Engineer' })
  @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Experienced Node.js engineer focused on microservices.' })
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

// ── Update Profile ───────────────────────────────────────────────────────────
export class UpdateProfileDto {
  @IsString()
  user_id!: string;

  @ApiPropertyOptional({ example: 'Senior Backend Engineer' })
  @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Experienced Node.js engineer.' })
  @IsOptional() @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'IN' })
  @IsOptional() @IsString()
  country_code?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsOptional() @IsString()
  location_city?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional() @IsInt() @Min(0) @Max(50)
  years_experience?: number;

  @ApiPropertyOptional({ enum: AvailabilityStatus })
  @IsOptional() @IsEnum(AvailabilityStatus)
  availability?: AvailabilityStatus;

  @ApiPropertyOptional({ enum: WorkModel })
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

  @ApiPropertyOptional({ example: 'https://portfolio.com' })
  @IsOptional() @IsUrl()
  portfolio_url?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional() @IsString()
  phone?: string;
}

// ── Get My Profile ───────────────────────────────────────────────────────────
export class GetMyProfileDto {
  @IsString()
  user_id!: string;
}

// ── Skills ───────────────────────────────────────────────────────────────────
export class SkillItemDto {
  @ApiProperty({ example: 'Node.js' })
  @IsString()
  skill_name!: string;

  @ApiProperty({ enum: SkillType, example: 'PRIMARY' })
  @IsEnum(SkillType)
  skill_type!: SkillType;

  @ApiPropertyOptional({ example: 'Backend' })
  @IsOptional() @IsString()
  category?: string;
}

export class UpdateSkillsDto {
  @IsString()
  user_id!: string;

  @ApiProperty({ type: [SkillItemDto] })
  @IsArray()
  skills!: SkillItemDto[];
}

// ── Projects ─────────────────────────────────────────────────────────────────
export class ProjectItemDto {
  @ApiProperty({ example: 'Talent Marketplace' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'A B2B platform connecting companies with talent' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Reduced hiring time by 60%' })
  @IsOptional() @IsString()
  impact_statement?: string;

  @ApiPropertyOptional({ example: ['NestJS', 'PostgreSQL', 'Redis'] })
  @IsOptional() @IsArray()
  tech_tags?: string[];

  @ApiPropertyOptional({ example: 'https://github.com/project' })
  @IsOptional() @IsUrl()
  github_url?: string;

  @ApiPropertyOptional({ example: 'https://project.com' })
  @IsOptional() @IsUrl()
  live_demo_url?: string;
}

export class UpdateProjectsDto {
  @IsString()
  user_id!: string;

  @ApiProperty({ type: [ProjectItemDto] })
  @IsArray()
  projects!: ProjectItemDto[];
}