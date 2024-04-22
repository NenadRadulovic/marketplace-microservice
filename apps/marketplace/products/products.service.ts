import { Injectable } from '@nestjs/common';
import { Product, Review, User } from '@app/common/database/entities';
import { FilterOptions, ProductRequest } from './products.dtos';
import { ProductRepository } from './products.repository';
import { ReviewRepository } from '../review/review.repository';
import { SelectQueryBuilder } from 'typeorm';

interface AvailableProduct {
  error: boolean;
  message: string;
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async create(data: ProductRequest): Promise<ProductRequest> {
    const newProduct = await this.productRepository.createEntity({
      ...data,
    } as Product);
    return newProduct as ProductRequest;
  }

  async update(
    product: Product,
    data: ProductRequest,
  ): Promise<ProductRequest> {
    const newProduct = await this.productRepository.updateEntity(product.id, {
      ...data,
    } as Product);
    return newProduct as ProductRequest;
  }

  async getById(id: string): Promise<ProductRequest> {
    const newProduct = await this.productRepository.findEntityById({
      where: { id },
      loadEagerRelations: true,
      relations: ['reviews'],
    });
    return newProduct as ProductRequest;
  }
  async getAll(filter: FilterOptions): Promise<Product[]> {
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

  async createReview(
    productId: string,
    data: any,
    user: User,
  ): Promise<Partial<Review>> {
    const product = await this.productRepository.findEntityById({
      where: { id: productId },
    });
    return await this.reviewRepository.createEntity({
      user,
      product,
      description: data.description,
    } as Review);
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
