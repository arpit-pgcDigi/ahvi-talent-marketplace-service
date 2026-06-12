import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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