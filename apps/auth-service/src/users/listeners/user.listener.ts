import { EMAIL_SERVICE } from '@app/common';
import { EmailContext, EmailData } from '@app/common/constants/msData';
import { User } from '@app/common/database/entities';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

interface SendEmailPayload {
  user: User;
  template: string;
  subject: string;
  context: EmailContext;
}

@Injectable()
export class UserListener {
  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy,
  ) {}

  @OnEvent('send_email')
  async handleSendEmailEvent(payload: SendEmailPayload): Promise<void> {
    const emailData: EmailData = {
      firstName: payload.user.firstName,
      lastName: payload.user.lastName,
      template: payload.template,
      subject: payload.subject,
      toEmail: payload.user.email,
      context: { ...payload.context },
    };
    return await lastValueFrom(this.emailService.emit('send_email', emailData));
  }
}
