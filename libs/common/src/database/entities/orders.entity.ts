import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: Relation<User>;

  @Column({ default: new Date() })
  purchaseDate: Date;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products: Relation<Product>[];
}
