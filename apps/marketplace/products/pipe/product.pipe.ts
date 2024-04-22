import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ProductRepository } from '../products.repository';
import { Product } from '@app/common/database/entities';

@Injectable()
export class ProductPipe implements PipeTransform {
  constructor(private readonly productRepository: ProductRepository) {}

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<Product | null> {
    return await this.productRepository.findEntityById({
      where: { id: value },
    });
  }
}
