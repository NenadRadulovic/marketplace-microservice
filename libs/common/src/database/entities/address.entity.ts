import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'street_name' })
  streetName: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ name: 'country_code' })
  countryCode: string;

  @Column()
  primary: boolean;

  @ManyToOne(() => User, (user) => user.address)
  user: Relation<User>;
}
