import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AdminRepository } from './admin.repository';
import {
  ApproveTalentDto,
  RejectTalentDto,
  BanUserDto,
  UpdateSettingDto,
  TALENT_EVENTS,
  TalentApprovedEvent,
  TalentRejectedEvent,
} from '@app/contracts';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    @Inject('EVENT_BUS') private readonly eventBus: ClientProxy,
  ) {}

  async listPendingProfiles(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { data, total } = await this.adminRepository.findPendingProfiles(skip, limit);
    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async getTalent(talentId: string) {
    const talent = await this.adminRepository.findTalentById(talentId);
    if (!talent) throw new NotFoundException(`Talent not found: ${talentId}`);
    return talent;
  }

  async approveTalent(dto: ApproveTalentDto) {
    const talent = await this.adminRepository.findTalentById(dto.talent_id);
    if (!talent) throw new NotFoundException(`Talent not found: ${dto.talent_id}`);
    if (talent.status !== 'PENDING') {
      throw new BadRequestException(`Cannot approve — profile status is ${talent.status}`);
    }

    const updated = await this.adminRepository.updateTalentStatus(
      dto.talent_id,
      'APPROVED',
      { approved_by: dto.admin_id, approved_at: new Date() },
    );

    await this.adminRepository.createApprovalLog({
      talent_id: dto.talent_id,
      reviewed_by: dto.admin_id,
      action: 'APPROVED',
      notes: dto.notes,
    });

    // Get user email for notification
    const user = await this.adminRepository.findUserById(talent.user_id);

    // Emit async event — notification-service listens to this
    // Fire and forget — admin doesn't wait for email to send
    const event: TalentApprovedEvent = {
      talent_id: dto.talent_id,
      user_id: talent.user_id,
      email: user?.email ?? '',
      full_name: talent.full_name,
      approved_by: dto.admin_id,
      approved_at: new Date(),
    };
    this.eventBus.emit(TALENT_EVENTS.APPROVED, event);
    this.logger.log(`Talent approved: ${dto.talent_id} — event emitted`);

    return updated;
  }

  async rejectTalent(dto: RejectTalentDto) {
    const talent = await this.adminRepository.findTalentById(dto.talent_id);
    if (!talent) throw new NotFoundException(`Talent not found: ${dto.talent_id}`);
    if (talent.status !== 'PENDING') {
      throw new BadRequestException(`Cannot reject — profile status is ${talent.status}`);
    }

    const updated = await this.adminRepository.updateTalentStatus(dto.talent_id, 'REJECTED');

    await this.adminRepository.createApprovalLog({
      talent_id: dto.talent_id,
      reviewed_by: dto.admin_id,
      action: 'REJECTED',
      notes: dto.reason,
    });

    const user = await this.adminRepository.findUserById(talent.user_id);

    const event: TalentRejectedEvent = {
      talent_id: dto.talent_id,
      user_id: talent.user_id,
      email: user?.email ?? '',
      full_name: talent.full_name,
      rejected_by: dto.admin_id,
      reason: dto.reason,
    };
    this.eventBus.emit(TALENT_EVENTS.REJECTED, event);
    this.logger.log(`Talent rejected: ${dto.talent_id} — event emitted`);

    return updated;
  }

  async getDashboard() {
    return this.adminRepository.getDashboardStats();
  }

  async getAuditLogs(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { data, total } = await this.adminRepository.getAuditLogs(skip, limit);
    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async banUser(dto: BanUserDto) {
    const user = await this.adminRepository.findUserById(dto.user_id);
    if (!user) throw new NotFoundException(`User not found: ${dto.user_id}`);
    if (!user.is_active) throw new BadRequestException('User is already banned');
    await this.adminRepository.banUser(dto.user_id);
    this.logger.log(`User banned: ${dto.user_id} by admin: ${dto.admin_id}`);
    return { message: 'User banned successfully', user_id: dto.user_id };
  }

  async getSettings() {
    return this.adminRepository.getPlatformSettings();
  }

  async updateSetting(dto: UpdateSettingDto) {
    return this.adminRepository.upsertPlatformSetting(dto.key, dto.value, dto.admin_id);
  }
}