import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TalentProfile } from '@prisma/client';

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
    });
  }
}

 