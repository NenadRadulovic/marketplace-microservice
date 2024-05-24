import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './orders.entity';
import { Review } from './review.entity';
import { Address } from './address.entity';
import { PaymentInformation } from './payment_information.entity';
import { Marketplace } from './marketplace.entity';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
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

  @Column({
    nullable: true,
  })
  oauth_provider: string;

  @Column()
  email: string;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @Column({
    enum: UserRole,
    default: UserRole.USER,
    type: 'enum',
  })
  role: UserRole;

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @OneToMany(
    () => PaymentInformation,
    (paymentInformation) => paymentInformation.user,
  )
  paymentInformation: PaymentInformation[];

  @OneToMany(() => Marketplace, (marketplace) => marketplace.user)
  marketplace: Marketplace[];
}
