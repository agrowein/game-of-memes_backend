import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Reaction } from "../../cards/entities/reaction.entity";

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column({ default: 0 })
  likes: number;

  @ManyToMany(() => Reaction)
  @JoinTable()
  cards: Reaction[];
}
