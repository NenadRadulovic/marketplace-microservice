import { NestFactory } from '@nestjs/core';
import { BillingServiceModule } from './billing-service.module';
import { BILLING_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingServiceModule, {
    rawBody: true,
  });
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(BILLING_SERVICE));
  await app.startAllMicroservices();
  await app.listen(4242);
}
bootstrap();
