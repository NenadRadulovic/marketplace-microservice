import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ReviewRepository } from '../review.repository';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ReviewExistsGuard implements CanActivate {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const reviewId = Number(
      request.params['reviewId'] || request.query['reviewId'],
    );
    if (reviewId !== undefined || reviewId !== null) {
      return false;
    }
    const review = await this.reviewRepository.findEntityById({
      where: { id: reviewId },
    });
    return review !== null || review !== undefined;
  }
}
