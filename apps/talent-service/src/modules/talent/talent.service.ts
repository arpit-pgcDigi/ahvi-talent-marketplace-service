import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TalentRepository } from './talent.repository';
import { CreateProfileDto, GetProfileDto } from './dto/talent.dto';
import {
  UpdateProfileDto,
  GetMyProfileDto,
  UpdateSkillsDto,
  UpdateProjectsDto,
} from '@app/contracts';

@Injectable()
export class TalentService {
  constructor(private readonly talentRepository: TalentRepository) {}

  async createProfile(dto: CreateProfileDto) {
    const existing = await this.talentRepository.findByUserId(dto.user_id);
    if (existing) {
      throw new ConflictException('A profile already exists for this user');
    }
    const { user_id, ...rest } = dto;
    return this.talentRepository.create({ user_id, ...rest });
  }

  async getProfile(dto: GetProfileDto) {
    const profile = await this.talentRepository.findById(dto.talent_id);
    if (!profile) {
      throw new NotFoundException(`Talent profile not found: ${dto.talent_id}`);
    }
    return profile;
  }

  async getMyProfile(dto: GetMyProfileDto) {
    const profile = await this.talentRepository.findByUserId(dto.user_id);
    if (!profile) {
      throw new NotFoundException('You do not have a talent profile yet');
    }
    return profile;
  }

  async updateProfile(dto: UpdateProfileDto) {
    const { user_id, ...rest } = dto;
    const existing = await this.talentRepository.findByUserId(user_id);
    if (!existing) {
      throw new NotFoundException('Talent profile not found');
    }
    return this.talentRepository.update(user_id, rest);
  }

  async submitProfile(dto: { user_id: string }) {
    const profile = await this.talentRepository.findByUserId(dto.user_id);
    if (!profile) {
      throw new NotFoundException('Talent profile not found');
    }
    if (!['DRAFT', 'REJECTED'].includes(profile.status)) {
      throw new BadRequestException(
        `Profile cannot be submitted — current status is ${profile.status}`,
      );
    }
    return this.talentRepository.updateStatus(dto.user_id, 'PENDING', {
      submitted_at: new Date(),
    });
  }

  async updateSkills(dto: UpdateSkillsDto) {
    const { user_id, skills } = dto;
    const existing = await this.talentRepository.findByUserId(user_id);
    if (!existing) {
      throw new NotFoundException('Talent profile not found');
    }
    await this.talentRepository.replaceSkills(user_id, skills);
    return this.talentRepository.findByUserId(user_id);
  }

  async updateProjects(dto: UpdateProjectsDto) {
    const { user_id, projects } = dto;
    const existing = await this.talentRepository.findByUserId(user_id);
    if (!existing) {
      throw new NotFoundException('Talent profile not found');
    }
    await this.talentRepository.replaceProjects(user_id, projects);
    return this.talentRepository.findByUserId(user_id);
  }
}