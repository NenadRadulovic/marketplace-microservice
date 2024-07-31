import { Injectable } from '@nestjs/common';
import { Product } from '@app/common/database/entities';
import { FilterOptions } from './products.dtos';
import { ProductRepository } from './products.repository';
import { SelectQueryBuilder } from 'typeorm';

interface AvailableProduct {
  error: boolean;
  message: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: Product): Promise<Product> {
    const newProduct = await this.productRepository.createEntity(data);
    return newProduct;
  }

  async update(productId: string, data: Product): Promise<Product> {
    const newProduct = await this.productRepository.updateEntity(
      productId,
      data,
    );
    return newProduct;
  }

  async getById(id: string): Promise<Product> {
    const newProduct = await this.productRepository.findEntityById({
      where: { id },
      loadEagerRelations: true,
      relations: ['reviews'],
    });
    return newProduct;
  }
  async getAll(filter?: FilterOptions): Promise<Product[]> {
    if (Object.keys(filter).length === 0) {
      return await this.productRepository.findAllEntity();
    }
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    this.applyFilters(filter, queryBuilder);
    return await queryBuilder.getMany();
  }
  async delete(id: string): Promise<boolean> {
    return await this.productRepository.removeEntity(id);
  }

  async updateProductsOnOrderMade(productIds: string[]): Promise<boolean> {
    productIds.forEach(async (productId) => {
      const product = await this.productRepository.findEntityById({
        where: { id: productId },
      });
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

  private applyFilters(
    filter: FilterOptions,
    queryBuilder: SelectQueryBuilder<Product>,
  ) {
    console.log('FITLERS!!!', filter);
    Object.keys(filter).forEach((key) => {
      switch (key) {
        case 'inStock': {
          queryBuilder.andWhere('product.in_stock >= :inStock', {
            inStock: filter.inStock,
          });
          break;
        }
        case 'created_at': {
          queryBuilder.andWhere('product.created_at >= :created_at', {
            created_at: filter.created_at,
          });
          break;
        }
        case 'price': {
          queryBuilder.andWhere('product.price >= :price', {
            price: filter.price,
          });
          break;
        }
        case 'sort_by': {
          queryBuilder.orderBy(
            `product.${filter.sort_by}`,
            filter.sortOrder ?? 'ASC',
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
