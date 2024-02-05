import { Controller } from '@nestjs/common';
import { BillingServiceService } from './billing-service.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Orders, Product, User } from '@app/common/database/entities';
import { RmqService } from '@app/common';
import { StripeService } from '../stripe/stripe.service';
import { StripeData } from '@app/common/constants/msData';

@Controller()
export class BillingServiceController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('create_stripe_user')
  async createStripeUser(
    @Payload() data: User,
    @Ctx() ctx: RmqContext,
  ): Promise<StripeData> {
    const customerData = await this.stripeService.createCustomer(data);
    this.rmqService.ack(ctx);
    return { stripeId: customerData.id };
  }

  @MessagePattern('create_stripe_product')
  async createStripeProduct(
    @Payload() data: Product,
    @Ctx() ctx: RmqContext,
  ): Promise<StripeData> {
    this.rmqService.ack(ctx);
    const productData = await this.stripeService.createProduct(data);
    return { stripeId: productData.id };
  }

  @MessagePattern('create_stripe_order')
  async createStripeOrder(
    @Payload() data: Orders,
    @Ctx() ctx: RmqContext,
  ): Promise<StripeData> {
    this.rmqService.ack(ctx);
    return { stripeId: '' };
  }

  @EventPattern('billing_test')
  handleBillingTest(@Ctx() ctx: RmqContext) {
    console.log('HELLO FROM BILLING MS');
    this.rmqService.ack(ctx);
    return 'Billing service alive';
  }
}
