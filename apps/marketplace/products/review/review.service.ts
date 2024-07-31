import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { Review } from '@app/common/database/entities';
import { CreateReviewRequest } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(review: Review): Promise<Review> {
    if (this.reviewAlreadyExists(review.user.id, review.product.id)) {
      throw new BadRequestException(
        'User has already left a review on that product',
      );
    }
    const data = await this.reviewRepository.createEntity(review);
    return data;
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const result = await this.reviewRepository.removeEntity(reviewId);
    return result;
  }

  async updateReview(review: Review): Promise<Review> {
    const result = await this.reviewRepository.updateEntity(review.id, review);
    return result;
  }

  private async reviewAlreadyExists(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const review = await this.reviewRepository.findEntityById({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return review !== undefined || review !== null;
  }
}
