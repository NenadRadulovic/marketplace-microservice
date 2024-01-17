import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@app/common';
import { Request } from 'express';
import { OrderDto } from './dto/orders.dto';
import { User } from '@app/common/database/entities';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrders(@Req() req: Request, @Body() data: OrderDto) {
    return this.ordersService.createOrder(req.user as User, data.products);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getOrders(@Req() req: Request) {
    return this.ordersService.getOrders(req.user as User);
  }
}
