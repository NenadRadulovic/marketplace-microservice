import { OrderCreatedEvent } from '@app/common/events/orderCreated.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsService } from '../products.service';

@Injectable()
export class UpdateOrderStockListener {
  constructor(private readonly productService: ProductsService) {}

  @OnEvent('order_purchased')
  handleOrderPurchasedEvent(payload: OrderCreatedEvent): void {
    this.productService.updateProductsOnOrderMade(payload.products);
  }
}
