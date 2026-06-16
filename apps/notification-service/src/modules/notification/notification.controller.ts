import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TALENT_EVENTS, TalentApprovedEvent, TalentRejectedEvent } from '@app/contracts';
import { NotificationService } from './notification.service';

// This service only listens — it never sends messages back
// @EventPattern vs @MessagePattern:
// @EventPattern = fire and forget, no response expected
// @MessagePattern = request/reply, response required
@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(TALENT_EVENTS.APPROVED)
  async handleTalentApproved(@Payload() event: TalentApprovedEvent) {
    this.logger.log(`Event received: talent.approved for ${event.email}`);
    await this.notificationService.sendTalentApprovedEmail(event);
  }

  @EventPattern(TALENT_EVENTS.REJECTED)
  async handleTalentRejected(@Payload() event: TalentRejectedEvent) {
    this.logger.log(`Event received: talent.rejected for ${event.email}`);
    await this.notificationService.sendTalentRejectedEmail(event);
  }
}