import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EMAIL_SERVICE, PgDatabaseModule, RmqModule } from '@app/common';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReviewModule } from '../review/review.module';
import { APP_PIPE } from '@nestjs/core';
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
    PgDatabaseModule.register(),
    EventEmitterModule.forRoot(),
    ProductsModule,
    OrdersModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class MarketplaceModule {}
