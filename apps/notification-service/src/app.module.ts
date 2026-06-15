import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './modules/notification/notification.module';

// No PrismaModule — notification-service has no database
// It only consumes events and sends emails
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationModule,
  ],
})
export class AppModule {}