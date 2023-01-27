import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';
import { PlayStatus } from "../const";
import { History } from "./history.entity";

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ type: "enum", default: PlayStatus.Pending, enum: PlayStatus })
  status: PlayStatus;

  @Column()
  playersCount: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @ManyToOne(() => User)
  creator: User;

  @OneToOne(() => History, history => history.game)
  history: History;

  @OneToMany(() => User, user => user.currentGame)
  @JoinTable()
  players: User[];

  @ManyToMany(() => Card)
  @JoinTable()
  pictures: Card[];

  @ManyToMany(() => Card)
  @JoinTable()
  situations: Card[];
}
