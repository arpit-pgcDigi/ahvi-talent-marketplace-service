import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TALENT_PATTERNS } from '@app/contracts';
import { TalentService } from './talent.service';
import { CreateProfileDto, GetProfileDto } from './dto/talent.dto';

@Controller()
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @MessagePattern(TALENT_PATTERNS.CREATE_PROFILE)
  createProfile(@Payload() dto: CreateProfileDto) {
    return this.talentService.createProfile(dto);
  }

  @MessagePattern(TALENT_PATTERNS.GET_PROFILE)
  getProfile(@Payload() dto: GetProfileDto) {
    return this.talentService.getProfile(dto);
  }
}