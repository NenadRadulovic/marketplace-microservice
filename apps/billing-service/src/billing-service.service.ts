import { User } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BillingServiceService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  public async createCustomer(user: User) {
    return this.stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      balance: 100000,
    });
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
