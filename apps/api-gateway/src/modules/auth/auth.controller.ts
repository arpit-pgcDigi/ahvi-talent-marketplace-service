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
import { Throttle, SkipThrottle } from '@nestjs/throttler';
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
import { Public } from '@app/common';
import { SERVICE_TOKENS } from '../../config/clients.config';
import {
  RegisterRequestDto,
  LoginRequestDto,
  AuthResponseDto,
} from './dto/auth-gateway.dto';

const ValidationErrorSchema = {
  schema: {
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password must be longer than or equal to 8 characters'],
      error: 'Bad Request',
    },
  },
};
const ConflictErrorSchema = {
  schema: { example: { statusCode: 409, message: 'Email already registered', error: 'Conflict', timestamp: '2026-06-09T09:15:53.229Z' } },
};
const UnauthorizedErrorSchema = {
  schema: { example: { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized', timestamp: '2026-06-09T09:15:53.229Z' } },
};
const InternalErrorSchema = {
  schema: { example: { statusCode: 500, message: 'Internal server error', timestamp: '2026-06-09T09:15:53.229Z' } },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICE_TOKENS.AUTH) private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @Public()
  @Throttle({ auth: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns a JWT token. ' +
      'Use `TALENT` role with `TALENT_PORTAL` for engineers. ' +
      'Use `HIRING` role with `HIRING_PORTAL` for companies.',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'User registered successfully' })
  @ApiBadRequestResponse({ ...ValidationErrorSchema, description: 'Validation failed' })
  @ApiConflictResponse({ ...ConflictErrorSchema, description: 'Email already registered' })
  @ApiInternalServerErrorResponse({ ...InternalErrorSchema, description: 'Unexpected server error' })
  register(@Body() body: Record<string, unknown>) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.REGISTER, body).pipe(timeout(5000)),
    );
  }

  @Post('login')
  @Public()
  @Throttle({ auth: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Returns a JWT token valid for 7 days.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Login successful' })
  @ApiBadRequestResponse({ ...ValidationErrorSchema, description: 'Validation failed' })
  @ApiUnauthorizedResponse({ ...UnauthorizedErrorSchema, description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ ...InternalErrorSchema, description: 'Unexpected server error' })
  login(@Body() body: Record<string, unknown>) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGIN, body).pipe(timeout(5000)),
    );
  }
}