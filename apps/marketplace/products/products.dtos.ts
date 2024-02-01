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
