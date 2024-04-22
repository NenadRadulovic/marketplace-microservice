import { AbstractRepository } from '@app/common';
import { Review } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository extends AbstractRepository<Review> {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }
}
