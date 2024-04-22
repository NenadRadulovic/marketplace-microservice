import { Module } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '@app/common/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewRepository],
  exports: [ReviewRepository],
})
export class ReviewModule {}
