import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ReviewRepository } from '../review.repository';
import { Product, Review } from '@app/common/database/entities';

@Injectable()
export class ReviewPipe implements PipeTransform {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async transform(
    value: number,
    metadata: ArgumentMetadata,
  ): Promise<Review | null> {
    return await this.reviewRepository.findEntityById({
      where: { id: value },
    });
  }
}
