import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { clientsConfig } from './config/clients.config';
import { AuthController } from './modules/auth/auth.controller';
import { TalentController } from './modules/talent/talent.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register(clientsConfig),
  ],
  controllers: [
    AuthController,
    TalentController,
  ],
  providers: [
    // JwtAuthGuard needs to be a provider so NestJS
    // can inject AUTH ClientProxy into it
    JwtAuthGuard,
  ],
})
export class AppModule {}