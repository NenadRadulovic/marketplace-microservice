import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FilterOptions, ProductRequest, ReviewRequest } from './products.dtos';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { CurrentUser } from 'apps/auth-service/src/decorators/current-user.decorator';
import {
  Marketplace,
  Product,
  Review,
  User,
} from '@app/common/database/entities';
import { ProductPipe } from './pipe/product.pipe';
import { Response } from 'express';
import { TransformPipe } from '@app/common/pipes/transform.pipe';
import { MarketplacePipe } from '../src/pipe/marketplace.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body(new TransformPipe()) data: ProductRequest,
    @Body('marketplaceId', MarketplacePipe) marketplace: Marketplace,
    @Res() res: Response,
  ) {
    const newProduct = new Product({ ...data, marketplace });
    const response = await this.productService.create(newProduct);
    return res.status(200).json(response);
  }

  @Put(':id')
  async updateProduct(
    @Body(new TransformPipe()) data: ProductRequest,
    @Param('id', ProductPipe) product: Product,
    @Res() res: Response,
  ) {
    const updatedProduct = new Product({ ...product, ...data });
    const response = this.productService.update(product.id, updatedProduct);
    return res.status(200).json(response);
  }

  @Get(':id')
  async getProduct(
    @Param('id', ProductPipe) product: Product,
    @Res() res: Response,
  ) {
    return res.status(200).json(product);
  }
  @Get('')
  async getAll(@Query() query: FilterOptions, @Res() res: Response) {
    const response = await this.productService.getAll(query);
    return res.status(200).json(response);
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const status = await this.productService.delete(id);
    return res.status(200).json({ status });
  }
}
