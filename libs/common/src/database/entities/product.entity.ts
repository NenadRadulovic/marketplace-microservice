import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { Marketplace } from './marketplace.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ name: 'in_stock' })
  inStock: number;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Relation<Review>[];

  @ManyToOne(() => Marketplace, (marketplace) => marketplace.products, {
    nullable: false,
  })
  marketplace: Relation<Marketplace>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
