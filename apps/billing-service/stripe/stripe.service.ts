import { Orders, Product, User } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  public async createCustomer(user: User): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      balance: 100000,
    });
  }

  public async createProduct(product: Product): Promise<Stripe.Product> {
    return await this.stripe.products.create({
      name: product.name,
      default_price_data: {
        currency: 'usd',
        unit_amount: product.price,
      },
    });
  }

  public async createPaymentIntents(
    orders: Orders,
  ): Promise<Stripe.PaymentIntent> {
    const paymentMethod = await this.createPaymentMethod();
    return await this.stripe.paymentIntents.create({
      amount: orders.products.reduce((sum, { price }) => sum + price, 0),
      currency: 'usd',
      customer: orders.user.stripeId,
      payment_method: paymentMethod.id,
      confirm: true,
    });
  }

  private async createPaymentMethod(): Promise<Stripe.PaymentMethod> {
    const paymentMethods = await this.stripe.paymentMethods.list();
    if (paymentMethods.data.length > 0) {
      return paymentMethods.data[0];
    }
    return await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 8,
        exp_year: 2026,
        cvc: '314',
      },
    });
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    return await this.stripe.webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret,
    );
  }

  public async charge(
    amount: number,
    paymentMethodId: string,
    customerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
