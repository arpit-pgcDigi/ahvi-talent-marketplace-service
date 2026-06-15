import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import {
  ApproveTalentDto,
  RejectTalentDto,
  BanUserDto,
  UpdateSettingDto,
} from '@app/contracts';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepository: AdminRepository) {}

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

    this.logger.log(`Talent approved: ${dto.talent_id} by admin: ${dto.admin_id}`);

    // TODO: emit TALENT_APPROVED event for notification-service
    // this.eventClient.emit(TALENT_EVENTS.APPROVED, { ... })

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

    this.logger.log(`Talent rejected: ${dto.talent_id} by admin: ${dto.admin_id}`);

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
    this.logger.log(`User banned: ${dto.user_id} by admin: ${dto.admin_id} — ${dto.reason}`);

    return { message: 'User banned successfully', user_id: dto.user_id };
  }

  async getSettings() {
    return this.adminRepository.getPlatformSettings();
  }

  async updateSetting(dto: UpdateSettingDto) {
    return this.adminRepository.upsertPlatformSetting(dto.key, dto.value, dto.admin_id);
  }
}