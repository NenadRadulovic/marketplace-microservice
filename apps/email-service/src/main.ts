import { NestFactory } from '@nestjs/core';
import { EmailServiceModule } from './email-service.module';
import { EMAIL_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EmailServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(EMAIL_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
