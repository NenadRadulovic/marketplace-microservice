import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  inStock: number;
}

export class ReviewRequest {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export interface FilterOptions {
  inStock?: number;
  created_at?: Date;
  price?: number;
  sort_by?: 'inStock' | 'created_at';
  sortOrder?: 'ASC' | 'DESC';
}
