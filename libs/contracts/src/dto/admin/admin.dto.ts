import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveTalentDto {
  @ApiProperty({ example: 'uuid-of-talent-profile' })
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @ApiProperty({ example: 'uuid-of-admin-user' })
  @IsString() @IsNotEmpty()
  admin_id!: string;

  @ApiPropertyOptional({ example: 'Profile meets all requirements' })
  @IsOptional() @IsString()
  notes?: string;
}

export class RejectTalentDto {
  @ApiProperty({ example: 'uuid-of-talent-profile' })
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @ApiProperty({ example: 'uuid-of-admin-user' })
  @IsString() @IsNotEmpty()
  admin_id!: string;

  @ApiProperty({ example: 'Incomplete work history' })
  @IsString() @IsNotEmpty()
  reason!: string;
}

export class GetTalentDto {
  @ApiProperty({ example: 'uuid-of-talent-profile' })
  @IsString() @IsNotEmpty()
  talent_id!: string;
}

export class BanUserDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString() @IsNotEmpty()
  user_id!: string;

  @ApiProperty({ example: 'uuid-of-admin' })
  @IsString() @IsNotEmpty()
  admin_id!: string;

  @ApiProperty({ example: 'Violation of terms of service' })
  @IsString() @IsNotEmpty()
  reason!: string;
}

export class UpdateSettingDto {
  @ApiProperty({ example: 'platform_fee_percentage' })
  @IsString() @IsNotEmpty()
  key!: string;

  @ApiProperty({ example: '7' })
  @IsString() @IsNotEmpty()
  value!: string;

  @ApiProperty({ example: 'uuid-of-admin' })
  @IsString() @IsNotEmpty()
  admin_id!: string;
}