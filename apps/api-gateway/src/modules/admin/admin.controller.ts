import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ADMIN_PATTERNS } from '@app/contracts';
import { CurrentUser, UserPayload, Roles } from '@app/common';
import { Role } from '@prisma/client';
import { SERVICE_TOKENS } from '../../config/clients.config';

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@Controller('admin')
@Roles(Role.SUPERADMIN)
export class AdminController {
  constructor(
    @Inject(SERVICE_TOKENS.ADMIN) private readonly adminClient: ClientProxy,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  @ApiOkResponse({ description: 'Dashboard statistics' })
  getDashboard() {
    return firstValueFrom(
      this.adminClient.send(ADMIN_PATTERNS.GET_DASHBOARD, {}).pipe(timeout(5000)),
    );
  }

  @Get('talents/pending')
  @ApiOperation({ summary: 'List pending talent profiles' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  listPending(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.LIST_PENDING, { page: +page, limit: +limit })
        .pipe(timeout(5000)),
    );
  }

  @Get('talents/:id')
  @ApiOperation({ summary: 'Get talent profile detail for review' })
  @ApiParam({ name: 'id', description: 'Talent profile UUID' })
  getTalent(@Param('id') id: string) {
    return firstValueFrom(
      this.adminClient.send(ADMIN_PATTERNS.GET_TALENT, { talent_id: id }).pipe(timeout(5000)),
    );
  }

  @Post('talents/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a talent profile' })
  @ApiParam({ name: 'id', description: 'Talent profile UUID' })
  approveTalent(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: UserPayload,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.APPROVE_TALENT, { ...body, talent_id: id, admin_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Post('talents/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a talent profile' })
  @ApiParam({ name: 'id', description: 'Talent profile UUID' })
  rejectTalent(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: UserPayload,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.REJECT_TALENT, { ...body, talent_id: id, admin_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.GET_AUDIT_LOGS, { page: +page, limit: +limit })
        .pipe(timeout(5000)),
    );
  }

  @Post('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ban a user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  banUser(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: UserPayload,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.BAN_USER, { ...body, user_id: id, admin_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all platform settings' })
  getSettings() {
    return firstValueFrom(
      this.adminClient.send(ADMIN_PATTERNS.GET_SETTINGS, {}).pipe(timeout(5000)),
    );
  }

  @Post('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a platform setting' })
  updateSetting(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: UserPayload,
  ) {
    return firstValueFrom(
      this.adminClient
        .send(ADMIN_PATTERNS.UPDATE_SETTING, { ...body, admin_id: user.sub })
        .pipe(timeout(5000)),
    );
  }
}