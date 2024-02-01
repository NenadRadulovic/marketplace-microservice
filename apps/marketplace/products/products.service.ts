import { Injectable } from '@nestjs/common';
import { Product } from '@app/common/database/entities';
import { ProductRequest } from './products.dtos';
import { ProductRepository } from './products.repository';

interface AvailableProduct {
  error: boolean;
  message: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: ProductRequest): Promise<ProductRequest> {
    const newProduct = await this.productRepository.createEntity({
      ...data,
    } as Product);
    return newProduct as ProductRequest;
  }

  async update(id: string, data: ProductRequest): Promise<ProductRequest> {
    const newProduct = await this.productRepository.updateEntity(id, {
      ...data,
    } as Product);
    return newProduct as ProductRequest;
  }

  async getById(id: string): Promise<ProductRequest> {
    const newProduct = await this.productRepository.findEntityById(id);
    return newProduct as ProductRequest;
  }
  async getAll(): Promise<Product[]> {
    const newProduct = await this.productRepository.findAllEntity();
    return newProduct as Product[];
  }
  async delete(id: string): Promise<boolean> {
    return await this.productRepository.removeEntity(id);
  }

  async updateProductsOnOrderMade(productIds: string[]): Promise<boolean> {
    productIds.forEach(async (productId) => {
      const product = await this.productRepository.findEntityById(productId);
      product.inStock = product.inStock - 1;
      await this.productRepository.update({ id: productId }, product);
    });
    return true;
  }

  async isProductInStock(productIds: string[]): Promise<AvailableProduct> {
    let outOfStockProducts = await Promise.all(
      productIds.map(async (productId) => {
        const product = await this.getById(productId);
        if (product.inStock === 0) {
          return product;
        }
      }),
    );
    outOfStockProducts = outOfStockProducts.filter((product) => product);
    if (outOfStockProducts.length > 0) {
      return {
        error: true,
        message: `Products [${outOfStockProducts.map(
          (product) => product.name,
        )}] are out of stock`,
      };
    }
    return {
      message: '',
      error: false,
    };
  }
}
