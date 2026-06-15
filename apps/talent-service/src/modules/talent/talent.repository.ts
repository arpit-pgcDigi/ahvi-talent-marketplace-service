import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TalentProfile, TalentProfileStatus, AvailabilityStatus, WorkModel, SkillType } from '@prisma/client';

@Injectable()
export class TalentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    user_id: string;
    full_name: string;
    title?: string;
    bio?: string;
    country_code?: string;
    location_city?: string;
    years_experience?: number;
    timezone?: string;
    linkedin_url?: string;
    github_url?: string;
  }): Promise<TalentProfile> {
    return this.prisma.talentProfile.create({ data });
  }

  async findById(id: string): Promise<TalentProfile | null> {
    return this.prisma.talentProfile.findUnique({
      where: { id },
      include: {
        skills: true,
        badges: true,
        projects: true,
        previous_companies: true,
        skill_proficiencies: true,
        experience_snapshots: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<TalentProfile | null> {
    return this.prisma.talentProfile.findUnique({
      where: { user_id: userId },
      include: {
        skills: true,
        badges: true,
        projects: true,
        previous_companies: true,
        skill_proficiencies: true,
        experience_snapshots: true,
      },
    });
  }

  async update(userId: string, data: Partial<{
    title: string;
    bio: string;
    country_code: string;
    location_city: string;
    years_experience: number;
    availability: AvailabilityStatus;
    work_model: WorkModel;
    timezone: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    phone: string;
  }>): Promise<TalentProfile> {
    return this.prisma.talentProfile.update({
      where: { user_id: userId },
      data,
    });
  }

  async updateStatus(
    userId: string,
    status: TalentProfileStatus,
    extra?: { submitted_at?: Date },
  ): Promise<TalentProfile> {
    return this.prisma.talentProfile.update({
      where: { user_id: userId },
      data: { status, ...extra },
    });
  }

  async replaceSkills(
    userId: string,
    skills: Array<{ skill_name: string; skill_type: SkillType; category?: string }>,
  ): Promise<void> {
    const profile = await this.prisma.talentProfile.findUnique({
      where: { user_id: userId },
      select: { id: true },
    });
    if (!profile) return;

    await this.prisma.$transaction([
      this.prisma.talentSkill.deleteMany({ where: { talent_id: profile.id } }),
      this.prisma.talentSkill.createMany({
        data: skills.map((s) => ({ ...s, talent_id: profile.id })),
      }),
    ]);
  }

  async replaceProjects(
    userId: string,
    projects: Array<{
      title: string;
      description?: string;
      impact_statement?: string;
      tech_tags?: string[];
      github_url?: string;
      live_demo_url?: string;
    }>,
  ): Promise<void> {
    const profile = await this.prisma.talentProfile.findUnique({
      where: { user_id: userId },
      select: { id: true },
    });
    if (!profile) return;

    await this.prisma.$transaction([
      this.prisma.talentProject.deleteMany({ where: { talent_id: profile.id } }),
      this.prisma.talentProject.createMany({
        data: projects.map((p, i) => ({
          ...p,
          talent_id: profile.id,
          sort_order: i,
          tech_tags: p.tech_tags ?? [],
        })),
      }),
    ]);
  }
}