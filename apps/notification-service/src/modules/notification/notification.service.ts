import { Injectable, Logger } from '@nestjs/common';
import { TalentApprovedEvent, TalentRejectedEvent } from '@app/contracts';

// In production replace console logs with a real email provider:
// SendGrid: npm install @sendgrid/mail
// Nodemailer: npm install nodemailer
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendTalentApprovedEmail(event: TalentApprovedEvent): Promise<void> {
    this.logger.log(
      `📧 Sending approval email to ${event.email} for talent: ${event.full_name}`,
    );

    // TODO: replace with real email provider
    // await this.sendgrid.send({
    //   to: event.email,
    //   subject: 'Your profile has been approved!',
    //   text: `Hi ${event.full_name}, your talent profile is now live on the marketplace.`
    // });

    this.logger.log(`✅ Approval email sent to ${event.email}`);
  }

  async sendTalentRejectedEmail(event: TalentRejectedEvent): Promise<void> {
    this.logger.log(
      `📧 Sending rejection email to ${event.email} for talent: ${event.full_name}`,
    );

    // TODO: replace with real email provider

    this.logger.log(`✅ Rejection email sent to ${event.email} — reason: ${event.reason}`);
  }
}