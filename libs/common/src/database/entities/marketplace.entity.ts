import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Feature } from './feature.entity';
import { Product } from './product.entity';

@Entity()
export class Marketplace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @ManyToOne(() => User, (user) => user.marketplace, {
    nullable: false,
  })
  user: Relation<User>;

  @OneToMany(() => Feature, (feature) => feature.marketplace)
  features: Relation<Feature>[];

  @OneToMany(() => Product, (product) => product.marketplace)
  products: Relation<Product>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Marketplace>) {
    Object.assign(this, partial);
  }
}
