import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ default: new Date() })
  purchaseDate: Date;

  @Column({ nullable: true })
  stripeId: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products: Product[];
}
