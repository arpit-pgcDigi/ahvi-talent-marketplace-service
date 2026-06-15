import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('NotificationService');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
  );

  // No ValidationPipe for notification-service
  // It only consumes events — no incoming DTOs to validate

  app.enableShutdownHooks();
  await app.listen();
  logger.log('Notification service listening on Redis transport');
}

bootstrap();