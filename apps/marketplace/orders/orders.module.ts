import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {
  AuthModule,
  EMAIL_SERVICE,
  PgDatabaseModule,
  RmqModule,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '@app/common/database/entities';
import { OrderRepository } from './orders.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    PgDatabaseModule,
    TypeOrmModule.forFeature([Orders]),
    RmqModule.register({ name: EMAIL_SERVICE }),
    AuthModule,
    ProductsModule,
  ],
  providers: [OrdersService, OrderRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
