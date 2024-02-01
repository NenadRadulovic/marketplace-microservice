import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { AUTH_SERVICE, RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(rmqService.getOptions(AUTH_SERVICE));
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
