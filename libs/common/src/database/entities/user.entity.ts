import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './orders.entity';
import { Review } from './review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  stripeId: string;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
