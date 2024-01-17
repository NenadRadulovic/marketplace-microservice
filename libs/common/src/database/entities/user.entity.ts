import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './orders.entity';

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

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
