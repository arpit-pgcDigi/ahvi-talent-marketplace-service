import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
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
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  TALENT_PATTERNS,
  CreateProfileDto as CreateProfileRequestDto,
  TalentProfileResponseDto,
  UpdateProfileDto,
  UpdateSkillsDto,
  UpdateProjectsDto,
} from '@app/contracts';
import { CurrentUser, UserPayload } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SERVICE_TOKENS } from '../../config/clients.config';

const UnauthorizedSchema = { schema: { example: { statusCode: 401, message: 'Invalid or expired token', timestamp: '2026-06-09T09:15:53.229Z' } } };
const NotFoundSchema = { schema: { example: { statusCode: 404, message: 'Talent profile not found', timestamp: '2026-06-09T09:15:53.229Z' } } };
const ConflictSchema = { schema: { example: { statusCode: 409, message: 'A profile already exists for this user', timestamp: '2026-06-09T09:15:53.229Z' } } };
const ValidationSchema = { schema: { example: { statusCode: 400, message: ['full_name should not be empty'], error: 'Bad Request' } } };
const InternalErrorSchema = { schema: { example: { statusCode: 500, message: 'Internal server error', timestamp: '2026-06-09T09:15:53.229Z' } } };

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
  @ApiOperation({ summary: 'Create talent profile', description: 'Creates a new talent profile in DRAFT status.' })
  @ApiBody({ type: CreateProfileRequestDto })
  @ApiCreatedResponse({ type: TalentProfileResponseDto, description: 'Profile created in DRAFT status' })
  @ApiBadRequestResponse({ ...ValidationSchema, description: 'Validation failed' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  @ApiConflictResponse({ ...ConflictSchema, description: 'Profile already exists' })
  createProfile(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.CREATE_PROFILE, { ...body, user_id: user.sub }).pipe(timeout(5000)),
    );
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Get my talent profile', description: 'Returns the authenticated talent\'s own profile.' })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Your talent profile' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  @ApiNotFoundResponse({ ...NotFoundSchema, description: 'You do not have a profile yet' })
  getMyProfile(@CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.GET_MY_PROFILE, { user_id: user.sub }).pipe(timeout(5000)),
    );
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get talent profile by ID', description: 'Returns full talent profile including skills, badges and projects.' })
  @ApiParam({ name: 'id', description: 'Talent profile UUID', example: 'e56c289c-d84d-4c0a-933a-48b58728bf5a' })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Talent profile found' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  @ApiNotFoundResponse({ ...NotFoundSchema, description: 'Profile not found' })
  getProfile(@Param('id') id: string) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.GET_PROFILE, { talent_id: id }).pipe(timeout(5000)),
    );
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update my talent profile', description: 'Updates the authenticated talent\'s profile fields.' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Profile updated successfully' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  @ApiNotFoundResponse({ ...NotFoundSchema, description: 'Profile not found' })
  updateProfile(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.UPDATE_PROFILE, { ...body, user_id: user.sub }).pipe(timeout(5000)),
    );
  }

  @Post('profile/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit profile for review', description: 'Submits DRAFT or REJECTED profile for admin review. Status changes to PENDING.' })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Profile submitted for review' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  @ApiBadRequestResponse({ ...ValidationSchema, description: 'Profile not in submittable state' })
  submitProfile(@CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.SUBMIT_PROFILE, { user_id: user.sub }).pipe(timeout(5000)),
    );
  }

  @Post('profile/skills')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update skills', description: 'Replaces all skills for the authenticated talent.' })
  @ApiBody({ type: UpdateSkillsDto })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Skills updated' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  updateSkills(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.UPDATE_SKILLS, { ...body, user_id: user.sub }).pipe(timeout(5000)),
    );
  }

  @Post('profile/projects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update projects', description: 'Replaces all projects for the authenticated talent.' })
  @ApiBody({ type: UpdateProjectsDto })
  @ApiOkResponse({ type: TalentProfileResponseDto, description: 'Projects updated' })
  @ApiUnauthorizedResponse({ ...UnauthorizedSchema, description: 'Invalid or missing JWT token' })
  updateProjects(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.talentClient.send(TALENT_PATTERNS.UPDATE_PROJECTS, { ...body, user_id: user.sub }).pipe(timeout(5000)),
    );
  }
}