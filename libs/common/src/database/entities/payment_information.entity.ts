import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PaymentInformation {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column({ name: 'card_number' })
  cardNumber: number;

  @Column()
  primary: boolean;

  @ManyToOne(() => User, (user) => user.paymentInformation)
  user: Relation<User>;
}
