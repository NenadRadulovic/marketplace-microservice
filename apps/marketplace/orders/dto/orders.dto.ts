import { IsArray } from 'class-validator';

export class OrderDto {
  @IsArray()
  products: Array<string>;
}
