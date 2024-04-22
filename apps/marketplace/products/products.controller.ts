import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FilterOptions, ProductRequest, ReviewRequest } from './products.dtos';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { CurrentUser } from 'apps/auth-service/src/decorators/current-user.decorator';
import { Product, Review, User } from '@app/common/database/entities';
import { ProductPipe } from './pipe/product.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() data: ProductRequest): Promise<ProductRequest> {
    return await this.productService.create(data);
  }

  @Put(':id')
  async updateProduct(
    @Body() data: ProductRequest,
    @Param('id', ProductPipe) product: Product,
  ): Promise<ProductRequest> {
    return await this.productService.update(product, data);
  }

  @Get(':id')
  async getProduct(@Param('id', ProductPipe) product: Product) {
    return product;
  }
  @Get('')
  async getAll(@Query() query: FilterOptions): Promise<ProductRequest[]> {
    return await this.productService.getAll(query);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.productService.delete(id);
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: ReviewRequest,
    @CurrentUser() user: User,
  ): Promise<Review> {
    const result = await this.productService.createReview(id, data, user);
    return result as Review;
  }
}
