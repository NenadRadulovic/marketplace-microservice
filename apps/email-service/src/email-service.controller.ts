import { Controller } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { EmailData } from '@app/common/constants/msData';

@Controller()
export class EmailServiceController {
  constructor(
    private readonly emailServiceService: EmailServiceService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('send_email')
  handleUserCreatedMail(@Payload() data: EmailData): void {
    this.emailServiceService.sendEmail(data);
  }

  @EventPattern('test_email')
  emailMsHealthcheck(): string {
    return 'Email MS alive!';
  }
}
