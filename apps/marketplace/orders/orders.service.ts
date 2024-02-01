import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderRepository } from './orders.repository';
import { Orders, User } from '@app/common/database/entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductsService } from '../products/products.service';
import { EMAIL_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly productService: ProductsService,
    private readonly eventEmmiter: EventEmitter2,
    @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy,
  ) {}

  async createOrder(user: User, products: Array<string>): Promise<Orders> {
    const productAvailability = await this.productService.isProductInStock(
      products,
    );
    if (productAvailability.error) {
      throw new UnprocessableEntityException(productAvailability.message);
    }
    const productsModel = await this.productService.getAll();
    const filteredProducts = productsModel.filter((pr) =>
      products.includes(pr.id),
    );
    const newOrder = await this.ordersRepository.createEntity({
      products: filteredProducts,
      user: user,
    } as Orders);

    lastValueFrom(
      this.emailService.emit('send_email', {
        firstName: user.firstName,
        lastName: user.lastName,
        template: 'order-made',
        subject: 'Thanks for purchasing',
        toEmail: user.email,
        context: {
          firstName: user.firstName,
          lastName: user.lastName,
          products: newOrder.products,
        },
      }),
    );
    this.eventEmmiter.emit('order_purchased', {
      products,
    });

    return newOrder;
  }

  async getOrders(user: User): Promise<Orders[]> {
    const orders = await this.ordersRepository.find({
      relations: { products: true },
      where: {
        user: { id: user.id },
      },
    });
    return orders;
  }

  async getOrderById(orderId: string): Promise<Orders> {
    const order = await this.ordersRepository.findOne({
      relations: { products: true },
      where: {
        id: orderId,
      },
    });
    return order;
  }
}
