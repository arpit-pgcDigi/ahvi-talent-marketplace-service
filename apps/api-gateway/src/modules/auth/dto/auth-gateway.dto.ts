import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address for the account',
  })
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Minimum 8 characters',
    minLength: 8,
  })
  password!: string;

  @ApiProperty({
    example: 'TALENT',
    enum: ['TALENT', 'HIRING', 'SUPERADMIN'],
    description: 'User role — determines access level',
  })
  role!: string;

  @ApiProperty({
    example: 'TALENT_PORTAL',
    enum: ['TALENT_PORTAL', 'HIRING_PORTAL', 'ADMIN_PORTAL'],
    description: 'Which portal this user belongs to',
  })
  portal!: string;
}

export class LoginRequestDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Registered email address',
  })
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Account password',
  })
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token — valid for 7 days',
  })
  access_token!: string;
}