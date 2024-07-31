import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthModule,
  EMAIL_SERVICE,
  PgDatabaseModule,
  RmqModule,
} from '@app/common';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReviewModule } from '../products/review/review.module';
import { APP_PIPE } from '@nestjs/core';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceRepository } from './marketplace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marketplace } from '@app/common/database/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([Marketplace]),
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
    AuthModule,
  ],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceService,
    MarketplaceRepository,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class MarketplaceModule {}
