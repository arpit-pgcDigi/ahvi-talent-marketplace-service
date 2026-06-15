import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TALENT_PATTERNS } from '@app/contracts';
import { TalentService } from './talent.service';
import { CreateProfileDto, GetProfileDto } from './dto/talent.dto';
import {
  UpdateProfileDto,
  GetMyProfileDto,
  UpdateSkillsDto,
  UpdateProjectsDto,
} from '@app/contracts';

@Controller()
export class TalentController {
  constructor(private readonly talentService: TalentService) { }

  @MessagePattern(TALENT_PATTERNS.CREATE_PROFILE)
  createProfile(@Payload() dto: CreateProfileDto) {
    return this.talentService.createProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.GET_PROFILE)
  getProfile(@Payload() dto: GetProfileDto) {
    return this.talentService.getProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.GET_MY_PROFILE)
  getMyProfile(@Payload() dto: GetMyProfileDto) {
    return this.talentService.getMyProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.UPDATE_PROFILE)
  updateProfile(@Payload() dto: UpdateProfileDto) {
    return this.talentService.updateProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.SUBMIT_PROFILE)
  submitProfile(@Payload() dto: { user_id: string }) {
    return this.talentService.submitProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.UPDATE_SKILLS)
  updateSkills(@Payload() dto: UpdateSkillsDto) {
    return this.talentService.updateSkills(dto);
  }

  @MessagePattern(TALENT_PATTERNS.UPDATE_PROJECTS)
  updateProjects(@Payload() dto: UpdateProjectsDto) {
    return this.talentService.updateProjects(dto);
  }
}