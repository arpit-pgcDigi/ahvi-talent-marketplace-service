import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TALENT_PATTERNS } from '@app/contracts';
import { CurrentUser, UserPayload } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SERVICE_TOKENS } from '../../config/clients.config';
import {
  CreateProfileDto as CreateProfileRequestDto,
  TalentProfileResponseDto,
} from '@app/contracts';

const UnauthorizedSchema = {
  schema: {
    example: {
      statusCode: 401,
      message: 'Invalid or expired token',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const ForbiddenSchema = {
  schema: {
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const NotFoundSchema = {
  schema: {
    example: {
      statusCode: 404,
      message: 'Talent profile not found',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const ConflictSchema = {
  schema: {
    example: {
      statusCode: 409,
      message: 'A profile already exists for this user',
      timestamp: '2026-06-09T09:15:53.229Z',
    },
  },
};

const ValidationSchema = {
  schema: {
    example: {
      statusCode: 400,
      message: ['full_name should not be empty'],
      error: 'Bad Request',
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

@ApiTags('Talent')
@ApiBearerAuth('JWT')
@Controller('talent')
@UseGuards(JwtAuthGuard)
export class TalentController {
  constructor(
    @Inject(SERVICE_TOKENS.TALENT) private readonly talentClient: ClientProxy,
  ) { }

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create talent profile',
    description:
      'Creates a new talent profile for the authenticated user. ' +
      'Profile starts in `DRAFT` status and is not visible on the marketplace. ' +
      'Submit the profile to move it to `PENDING` status for admin review.',
  })
  @ApiBody({ type: CreateProfileRequestDto })
  @ApiCreatedResponse({
    type: TalentProfileResponseDto,
    description: 'Profile created successfully in DRAFT status',
  })
  @ApiBadRequestResponse({
    ...ValidationSchema,
    description: 'Validation failed',
  })
  @ApiUnauthorizedResponse({
    ...UnauthorizedSchema,
    description: 'Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    ...ForbiddenSchema,
    description: 'Insufficient role permissions',
  })
  @ApiConflictResponse({
    ...ConflictSchema,
    description: 'Profile already exists for this user',
  })
  @ApiInternalServerErrorResponse({
    ...InternalErrorSchema,
    description: 'Unexpected server error',
  })
  createProfile(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: UserPayload,
  ) {
    return firstValueFrom(
      this.talentClient
        .send(TALENT_PATTERNS.CREATE_PROFILE, { ...body, user_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Get('profile/:id')
  @ApiOperation({
    summary: 'Get talent profile by ID',
    description:
      'Returns the full talent profile including skills, badges, projects, ' +
      'and experience snapshots.',
  })
  @ApiParam({
    name: 'id',
    description: 'Talent profile UUID',
    example: 'e56c289c-d84d-4c0a-933a-48b58728bf5a',
  })
  @ApiOkResponse({
    type: TalentProfileResponseDto,
    description: 'Talent profile found and returned',
  })
  @ApiUnauthorizedResponse({
    ...UnauthorizedSchema,
    description: 'Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    ...ForbiddenSchema,
    description: 'Insufficient role permissions',
  })
  @ApiNotFoundResponse({
    ...NotFoundSchema,
    description: 'Talent profile not found',
  })
  @ApiInternalServerErrorResponse({
    ...InternalErrorSchema,
    description: 'Unexpected server error',
  })
  getProfile(@Param('id') id: string) {
    return firstValueFrom(
      this.talentClient
        .send(TALENT_PATTERNS.GET_PROFILE, { talent_id: id })
        .pipe(timeout(5000)),
    );
  }
}