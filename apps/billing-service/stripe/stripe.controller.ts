import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const payload = req.rawBody;
    const event = await this.stripeService.constructEventFromPayload(
      signature,
      payload,
    );
    if (event.type === 'payment_intent.succeeded') {
      console.log(event);
      return res.send({ payment_status: 'OK!' });
    }
    console.log('HERE?');
  }

  @Get()
  async test(@Res() res: Response) {
    return res.send({ data: 'Works!' });
  }
}
