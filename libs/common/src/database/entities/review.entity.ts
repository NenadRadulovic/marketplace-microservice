import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.reviews, {
    nullable: false,
  })
  user: Relation<User>;

  @ManyToOne(() => Product, (product) => product.reviews, {
    nullable: false,
  })
  product: Relation<Product>;

  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}
