import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ADMIN_PATTERNS } from '@app/contracts';
import { AdminService } from './admin.service';
import {
    ApproveTalentDto,
    RejectTalentDto,
    BanUserDto,
    UpdateSettingDto,
} from '@app/contracts';

@Controller()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @MessagePattern(ADMIN_PATTERNS.LIST_PENDING)
    listPending(@Payload() dto: { page: number; limit: number }) {
        return this.adminService.listPendingProfiles(dto.page ?? 1, dto.limit ?? 20);
    }

    @MessagePattern(ADMIN_PATTERNS.GET_TALENT)
    getTalent(@Payload() dto: { talent_id: string }) {
        return this.adminService.getTalent(dto.talent_id);
    }

    @MessagePattern(ADMIN_PATTERNS.APPROVE_TALENT)
    approveTalent(@Payload() dto: ApproveTalentDto) {
        return this.adminService.approveTalent(dto);
    }

    @MessagePattern(ADMIN_PATTERNS.REJECT_TALENT)
    rejectTalent(@Payload() dto: RejectTalentDto) {
        return this.adminService.rejectTalent(dto);
    }

    @MessagePattern(ADMIN_PATTERNS.GET_DASHBOARD)
    getDashboard() {
        return this.adminService.getDashboard();
    }

    @MessagePattern(ADMIN_PATTERNS.GET_AUDIT_LOGS)
    getAuditLogs(@Payload() dto: { page: number; limit: number }) {
        return this.adminService.getAuditLogs(dto.page ?? 1, dto.limit ?? 20);
    }

    @MessagePattern(ADMIN_PATTERNS.BAN_USER)
    banUser(@Payload() dto: BanUserDto) {
        return this.adminService.banUser(dto);
    }

    @MessagePattern(ADMIN_PATTERNS.GET_SETTINGS)
    getSettings() {
        return this.adminService.getSettings();
    }

    @MessagePattern(ADMIN_PATTERNS.UPDATE_SETTING)
    updateSetting(@Payload() dto: UpdateSettingDto) {
        return this.adminService.updateSetting(dto);
    }
}