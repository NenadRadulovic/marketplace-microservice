import { EmailData } from '@app/common/constants/msData';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailServiceService {
  private readonly logger = new Logger(EmailServiceService.name);

  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(data: EmailData): Promise<void> {
    this.logger.log(`SENDING EMAIL TO ${data.toEmail}`);
    await this.mailerService.sendMail({
      template: data.template,
      context: data.context,
      to: {
        address: data.toEmail,
        name: `${data.firstName} + ${data.lastName}`,
      },
      from: { address: 'NestJSMS@example.com', name: 'Marketplace MS' },
      subject: data.subject,
    });
  }
}
