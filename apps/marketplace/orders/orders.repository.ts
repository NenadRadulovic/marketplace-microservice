import { AbstractRepository } from '@app/common';
import { Orders } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository extends AbstractRepository<Orders> {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {
    super(ordersRepository);
  }
}
