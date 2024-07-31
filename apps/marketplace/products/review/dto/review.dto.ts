import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewRequest {
  @IsString()
  @IsNotEmpty()
  description: string;
}
