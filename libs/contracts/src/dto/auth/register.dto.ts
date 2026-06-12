import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Portal } from '@prisma/client';

// Single definition used by BOTH api-gateway and auth-service
export class RegisterDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address for the account',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Minimum 8 characters',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @ApiProperty({
    example: 'TALENT',
    enum: Role,
    description: 'User role — determines access level',
  })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({
    example: 'TALENT_PORTAL',
    enum: Portal,
    description: 'Which portal this user belongs to',
  })
  @IsEnum(Portal)
  portal!: Portal;
}