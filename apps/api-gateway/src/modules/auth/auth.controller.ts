import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AUTH_PATTERNS } from '@app/contracts';
import { SERVICE_TOKENS } from '../../config/clients.config';
import {
  RegisterRequestDto,
  LoginRequestDto,
  AuthResponseDto,
} from './dto/auth-gateway.dto';

// Shared error response schemas
const ValidationErrorSchema = {
  schema: {
    example: {
      statusCode: 400,
      message: [
        'email must be an email',
        'password must be longer than or equal to 8 characters',
      ],
      error: 'Bad Request',
    },
  },
};

const ConflictErrorSchema = {
  schema: {
    example: {
      statusCode: 409,
      message: 'Email already registered',
      error: 'Conflict',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const UnauthorizedErrorSchema = {
  schema: {
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const InternalErrorSchema = {
  schema: {
    example: {
      statusCode: 500,
      message: 'Internal server error',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICE_TOKENS.AUTH) private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns a JWT token. ' +
      'Use `TALENT` role with `TALENT_PORTAL` for engineers. ' +
      'Use `HIRING` role with `HIRING_PORTAL` for companies.',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'User registered successfully — returns JWT token',
  })
  @ApiBadRequestResponse({
    ...ValidationErrorSchema,
    description: 'Validation failed — check field requirements',
  })
  @ApiConflictResponse({
    ...ConflictErrorSchema,
    description: 'Email already registered',
  })
  @ApiInternalServerErrorResponse({
    ...InternalErrorSchema,
    description: 'Unexpected server error',
  })
  register(@Body() body: RegisterRequestDto) {
    return firstValueFrom(
      this.authClient
        .send(AUTH_PATTERNS.REGISTER, body)
        .pipe(timeout(5000)),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email and password',
    description:
      'Authenticates a user and returns a JWT token valid for 7 days. ' +
      'Use the returned `access_token` in the Authorization header as `Bearer <token>`.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Login successful — returns JWT token',
  })
  @ApiBadRequestResponse({
    ...ValidationErrorSchema,
    description: 'Validation failed',
  })
  @ApiUnauthorizedResponse({
    ...UnauthorizedErrorSchema,
    description: 'Invalid email or password',
  })
  @ApiInternalServerErrorResponse({
    ...InternalErrorSchema,
    description: 'Unexpected server error',
  })
  login(@Body() body: LoginRequestDto) {
    return firstValueFrom(
      this.authClient
        .send(AUTH_PATTERNS.LOGIN, body)
        .pipe(timeout(5000)),
    );
  }
}