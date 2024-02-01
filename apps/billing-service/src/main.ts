import { NestFactory } from '@nestjs/core';
import { BillingServiceModule } from './billing-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingServiceModule);
  await app.listen(3000);
}
bootstrap();
