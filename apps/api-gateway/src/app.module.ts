import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { clientsConfig } from './config/clients.config';
import { AuthController } from './modules/auth/auth.controller';
import { TalentController } from './modules/talent/talent.controller';
import { AdminController } from './modules/admin/admin.controller';
import { MarketplaceController } from './modules/marketplace/marketplace.controller';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register(clientsConfig),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60000, limit: 100 },
      { name: 'auth', ttl: 60000, limit: 10 },
    ]),
  ],
  controllers: [
    HealthController,
    AuthController,
    TalentController,
    AdminController,
    MarketplaceController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    JwtAuthGuard,
  ],
})
export class AppModule { }