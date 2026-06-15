import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { clientsConfig } from './config/clients.config';
import { AuthController } from './modules/auth/auth.controller';
import { TalentController } from './modules/talent/talent.controller';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminController } from './modules/admin/admin.controller';
import { RolesGuard } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register(clientsConfig),

    // ── Rate limiting ────────────────────────────────────────────────────
    // Global default: 100 requests per 60 seconds per IP
    // Auth endpoints override this with much stricter limits (see controllers)
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,   // 60 seconds window
        limit: 100,   // 100 requests per window
      },
      {
        name: 'auth',
        ttl: 60000,   // 60 seconds window
        limit: 10,    // 10 requests per window — for login/register
      },
    ]),
  ],
  controllers: [
    HealthController,
    AuthController,
    TalentController,
    AdminController,
  ],
  providers: [
    // Guard order matters:
    // 1. ThrottlerGuard  — reject if rate limit exceeded
    // 2. JwtAuthGuard    — verify identity
    // 3. RolesGuard      — verify permissions
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtAuthGuard,
  ],
})
export class AppModule {}