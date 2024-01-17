import { Controller } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { EmailData } from '@app/common/constants/msData';

@Controller()
export class EmailServiceController {
  constructor(
    private readonly emailServiceService: EmailServiceService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('send_email')
  handleUserCreatedMail(
    @Payload() data: EmailData,
    @Ctx() context: RmqContext,
  ): void {
    this.emailServiceService.sendEmail(data);
    this.rmqService.ack(context);
  }

  @EventPattern('test_email')
  emailMsHealthcheck(): string {
    return 'Email MS alive!';
  }
}
