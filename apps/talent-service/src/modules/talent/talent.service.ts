import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TalentRepository } from './talent.repository';
import { CreateProfileDto, GetProfileDto } from './dto/talent.dto';

@Injectable()
export class TalentService {
  constructor(private readonly talentRepository: TalentRepository) {}

  async createProfile(dto: CreateProfileDto) {
    const existing = await this.talentRepository.findByUserId(dto.user_id);
    if (existing) {
      throw new RpcException(
        new ConflictException('A profile already exists for this user'),
      );
    }

    const { user_id, ...rest } = dto;
    return this.talentRepository.create({ user_id, ...rest });
  }

  async getProfile(dto: GetProfileDto) {
    const profile = await this.talentRepository.findById(dto.talent_id);
    if (!profile) {
      throw new RpcException(
        new NotFoundException(`Talent profile not found: ${dto.talent_id}`),
      );
    }
    return profile;
  }
}