import { Module } from '@nestjs/common';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { EngagementRepository } from './engagement.repository';

@Module({
  controllers: [EngagementController],
  providers: [EngagementService, EngagementRepository],
})
export class EngagementModule {}