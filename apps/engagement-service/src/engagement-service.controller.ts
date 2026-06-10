import { Controller, Get } from '@nestjs/common';
import { EngagementServiceService } from './engagement-service.service';

@Controller()
export class EngagementServiceController {
  constructor(private readonly engagementServiceService: EngagementServiceService) {}

  @Get()
  getHello(): string {
    return this.engagementServiceService.getHello();
  }
}
