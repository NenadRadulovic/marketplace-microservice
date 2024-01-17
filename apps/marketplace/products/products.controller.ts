import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductRequest } from './products.dtos';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

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
    @Param('id') id: string,
  ): Promise<ProductRequest> {
    return await this.productService.update(id, data);
  }

  @Get(':id')
  async getProduct(
    @Body() data: ProductRequest,
    @Param('id') id: string,
  ): Promise<ProductRequest> {
    return await this.productService.getById(id);
  }
  @Get('')
  async getAll(): Promise<ProductRequest[]> {
    return await this.productService.getAll();
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
