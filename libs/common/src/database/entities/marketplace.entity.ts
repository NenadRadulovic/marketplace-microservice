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

@Entity()
export class Marketplace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @ManyToOne(() => User, (user) => user.marketplace)
  user: Relation<User>;

  @OneToMany(() => Feature, (feature) => feature.marketplace)
  features: Relation<Feature>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
