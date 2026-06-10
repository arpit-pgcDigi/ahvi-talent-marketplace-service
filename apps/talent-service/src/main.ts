import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('TalentService');

  const redisPort = parseInt(process.env.REDIS_PORT ?? '6379', 10);
  const redisHost = process.env.REDIS_HOST ?? 'localhost';

  logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();
  await app.listen();
  logger.log('Talent service listening on Redis transport');
}

bootstrap();