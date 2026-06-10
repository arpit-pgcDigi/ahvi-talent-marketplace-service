import { Module } from '@nestjs/common';
import { EngagementServiceController } from './engagement-service.controller';
import { EngagementServiceService } from './engagement-service.service';

@Module({
  imports: [],
  controllers: [EngagementServiceController],
  providers: [EngagementServiceService],
})
export class EngagementServiceModule {}
