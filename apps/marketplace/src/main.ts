import { NestFactory } from '@nestjs/core';
import { MarketplaceModule } from './marketplace.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MarketplaceModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
