import { Module } from '@nestjs/common';
import { EmailServiceController } from './email-service.controller';
import { EmailServiceService } from './email-service.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_EMAILMS_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/email-service/.env',
    }),
    RmqModule,
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '3b5cbdf71891d5',
          pass: '92f72463c34de3',
        },
      },
      template: {
        dir: process.cwd() + '/apps/email-service/templates/',
        adapter: new EjsAdapter({ inlineCssEnabled: true }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
})
export class EmailServiceModule {}
