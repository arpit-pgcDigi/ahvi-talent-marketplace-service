import { NestFactory } from '@nestjs/core';
import { EngagementServiceModule } from './engagement-service.module';

async function bootstrap() {
  const app = await NestFactory.create(EngagementServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
