import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TalentProfile, TalentProfileStatus, ApprovalAction } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingProfiles(skip: number, take: number): Promise<{
    data: TalentProfile[];
    total: number;
  }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.talentProfile.findMany({
        where: { status: 'PENDING' },
        skip,
        take,
        orderBy: { submitted_at: 'asc' },
        include: { skills: true, user: { select: { email: true } } },
      }),
      this.prisma.talentProfile.count({ where: { status: 'PENDING' } }),
    ]);
    return { data, total };
  }

  async findTalentById(talentId: string): Promise<TalentProfile | null> {
    return this.prisma.talentProfile.findUnique({
      where: { id: talentId },
      include: {
        skills: true,
        badges: true,
        projects: true,
        user: { select: { email: true, role: true, is_active: true } },
      },
    });
  }

  async updateTalentStatus(
    talentId: string,
    status: TalentProfileStatus,
    extra?: { approved_by?: string; approved_at?: Date },
  ): Promise<TalentProfile> {
    return this.prisma.talentProfile.update({
      where: { id: talentId },
      data: { status, ...extra },
    });
  }

  async createApprovalLog(data: {
    talent_id: string;
    reviewed_by: string;
    action: ApprovalAction;
    notes?: string;
  }): Promise<void> {
    await this.prisma.approvalLog.create({ data });
  }

  async getDashboardStats(): Promise<{
    pending_approvals: number;
    approved_talents: number;
    total_users: number;
    total_orders: number;
  }> {
    const [pending, approved, users, orders] = await this.prisma.$transaction([
      this.prisma.talentProfile.count({ where: { status: 'PENDING' } }),
      this.prisma.talentProfile.count({ where: { status: 'APPROVED' } }),
      this.prisma.user.count(),
      this.prisma.order.count(),
    ]);
    return {
      pending_approvals: pending,
      approved_talents: approved,
      total_users: users,
      total_orders: orders,
    };
  }

  async getAuditLogs(skip: number, take: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.approvalLog.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          talent: { select: { full_name: true } },
          reviewer: { select: { email: true } },
        },
      }),
      this.prisma.approvalLog.count(),
    ]);
    return { data, total };
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async banUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is_active: false },
    });
  }

  async getPlatformSettings() {
    return this.prisma.platformSetting.findMany();
  }

  async upsertPlatformSetting(key: string, value: string, updatedBy: string) {
    return this.prisma.platformSetting.upsert({
      where: { key },
      update: { value, updated_by: updatedBy },
      create: { key, value, updated_by: updatedBy },
    });
  }
}