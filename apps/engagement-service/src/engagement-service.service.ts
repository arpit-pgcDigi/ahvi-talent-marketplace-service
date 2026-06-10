import { Injectable } from '@nestjs/common';

@Injectable()
export class EngagementServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
