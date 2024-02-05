import { Module } from '@nestjs/common';
import { BillingServiceController } from './billing-service.controller';
import { BillingServiceService } from './billing-service.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLINGMS_QUEUE: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().required(),
        STRIPE_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
      }),
      envFilePath: './apps/billing-service/.env',
    }),
    RmqModule,
    StripeModule,
  ],
  controllers: [BillingServiceController],
  providers: [BillingServiceService],
})
export class BillingServiceModule {}
