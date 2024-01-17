import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EMAIL_SERVICE, PgDatabaseModule, RmqModule } from '@app/common';
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
    PgDatabaseModule.register(),
    EventEmitterModule.forRoot(),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
