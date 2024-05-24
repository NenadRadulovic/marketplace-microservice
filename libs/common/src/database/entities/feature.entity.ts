import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Marketplace } from './marketplace.entity';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  name: string;

  @Column()
  enabled: boolean;

  @ManyToOne(() => Marketplace, (marketplace) => marketplace.features)
  marketplace: Relation<Marketplace>;
}
