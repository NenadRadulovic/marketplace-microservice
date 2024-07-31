import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '@app/common';
import { ProductPipe } from '../pipe/product.pipe';
import { Product, Review, User } from '@app/common/database/entities';
import { CurrentUser } from 'apps/auth-service/src/decorators/current-user.decorator';
import { Response } from 'express';
import { TransformPipe } from '@app/common/pipes/transform.pipe';
import { CreateReviewRequest } from './dto/review.dto';
import { ReviewPipe } from './pipe/review.pipe';
import { ReviewExistsGuard } from './guards/exists.guard';

@Controller('products/:id/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Param('id', ProductPipe) product: Product,
    @Body(new TransformPipe()) review: CreateReviewRequest,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const newReview = new Review({
      ...review,
      product,
      user,
    });
    const result = await this.reviewService.createReview(newReview);
    return res.status(200).json(result);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard, ReviewExistsGuard)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Res() res: Response,
  ) {
    const result = await this.reviewService.deleteReview(reviewId);
    return res.status(200).json(result);
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard, ReviewExistsGuard)
  async updateReview(
    @Param('reviewId', ReviewPipe) review: Review,
    @Body(new TransformPipe()) data: CreateReviewRequest,
    @Res() res: Response,
  ) {
    const updatedReview = new Review({
      ...review,
      ...data,
    });
    const result = await this.reviewService.updateReview(updatedReview);
    return res.status(200).json(result);
  }
}
