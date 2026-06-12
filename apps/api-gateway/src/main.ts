import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter, LoggingInterceptor, RolesGuard } from '@app/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const logger = new Logger('ApiGateway');

  const app = await NestFactory.create(AppModule);

  // ── Security headers ───────────────────────────────────────────────────
  // Helmet sets ~14 HTTP headers that protect against common attacks:
  // XSS, clickjacking, MIME sniffing, etc.
  // contentSecurityPolicy disabled because Swagger UI needs inline scripts.
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // ── CORS ───────────────────────────────────────────────────────────────
  // Only allow requests from your actual frontend origins.
  // In development, localhost:3001 (or wherever your frontend runs).
  // In production, replace with your actual domain.
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
      'http://localhost:3001',
      'http://localhost:5173',  // Vite default
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');

  // ── Swagger — only in non-production ──────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
    logger.log(`Swagger docs at http://localhost:${process.env.GATEWAY_PORT ?? 3000}/api/docs`);
  }

  app.enableShutdownHooks();

  const port = process.env.GATEWAY_PORT ?? 3000;
  await app.listen(port);
  logger.log(`API Gateway running on http://localhost:${port}/api/v1`);
  logger.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap();