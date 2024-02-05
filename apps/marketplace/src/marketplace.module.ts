import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  BILLING_SERVICE,
  EMAIL_SERVICE,
  PgDatabaseModule,
  RmqModule,
} from '@app/common';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    RmqModule.register({
      name: EMAIL_SERVICE,
    }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    PgDatabaseModule.register(),
    EventEmitterModule.forRoot(),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class MarketplaceModule {}
