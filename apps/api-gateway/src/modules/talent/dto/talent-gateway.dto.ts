import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileRequestDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full legal name of the talent',
  })
  full_name!: string;

  @ApiPropertyOptional({
    example: 'Senior Backend Engineer',
    description: 'Professional headline shown on the marketplace',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'Experienced Node.js and AWS engineer with a focus on microservices.',
    description: 'Short professional bio — max 500 characters',
  })
  bio?: string;

  @ApiPropertyOptional({
    example: 'IN',
    description: 'ISO 3166-1 alpha-2 country code',
  })
  country_code?: string;

  @ApiPropertyOptional({
    example: 'Bangalore',
    description: 'City of residence',
  })
  location_city?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Total years of professional experience',
    minimum: 0,
    maximum: 50,
  })
  years_experience?: number;

  @ApiPropertyOptional({
    example: 'REMOTE',
    enum: ['REMOTE', 'HYBRID', 'ONSITE'],
    description: 'Preferred work model',
  })
  work_model?: string;

  @ApiPropertyOptional({
    example: 'Asia/Kolkata',
    description: 'IANA timezone string',
  })
  timezone?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
    description: 'LinkedIn profile URL',
  })
  linkedin_url?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/johndoe',
    description: 'GitHub profile URL',
  })
  github_url?: string;
}

export class TalentProfileResponseDto {
  @ApiProperty({ example: 'e56c289c-d84d-4c0a-933a-48b58728bf5a' })
  id!: string;

  @ApiProperty({ example: 'c1d49d8b-d3dc-40e7-bf87-bed80a688c76' })
  user_id!: string;

  @ApiProperty({ example: 'John Doe' })
  full_name!: string;

  @ApiPropertyOptional({ example: 'Senior Backend Engineer' })
  title!: string | null;

  @ApiProperty({
    example: 'DRAFT',
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
    description: 'Profile goes DRAFT → PENDING → APPROVED/REJECTED',
  })
  status!: string;

  @ApiProperty({ example: '2026-06-09T09:15:53.229Z' })
  created_at!: Date;
}