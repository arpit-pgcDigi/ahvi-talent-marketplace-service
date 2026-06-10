import { Test, TestingModule } from '@nestjs/testing';
import { EngagementServiceController } from './engagement-service.controller';
import { EngagementServiceService } from './engagement-service.service';

describe('EngagementServiceController', () => {
  let engagementServiceController: EngagementServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EngagementServiceController],
      providers: [EngagementServiceService],
    }).compile();

    engagementServiceController = app.get<EngagementServiceController>(EngagementServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(engagementServiceController.getHello()).toBe('Hello World!');
    });
  });
});
