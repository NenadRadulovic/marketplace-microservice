import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  inStock: number;

  @Column({ nullable: true })
  stripeId: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
