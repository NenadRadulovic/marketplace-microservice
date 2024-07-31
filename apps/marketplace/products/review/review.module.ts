import { Module } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Review } from '@app/common/database/entities';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthModule } from '@app/common';
import { ProductRepository } from '../products.repository';
import { APP_GUARD } from '@nestjs/core';
import { ReviewExistsGuard } from './guards/exists.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product]), AuthModule],
  providers: [ReviewRepository, ReviewService, ProductRepository],
  controllers: [ReviewController],
  exports: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
