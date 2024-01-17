import { AbstractRepository } from '@app/common';
import { Product } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
}
