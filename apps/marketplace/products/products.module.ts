import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@app/common/database/entities';
import { ProductRepository } from './products.repository';
import { AuthModule, EMAIL_SERVICE, RmqModule } from '@app/common';
import { UpdateOrderStockListener } from './listeners/update-product-stock.listener';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    AuthModule,
    RmqModule.register({
      name: EMAIL_SERVICE,
    }),
    ReviewModule,
  ],
  providers: [ProductsService, ProductRepository, UpdateOrderStockListener],
  controllers: [ProductsController],
  exports: [ProductRepository, ProductsService],
})
export class ProductsModule {}
