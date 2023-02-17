import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PlayStatus } from "../const";

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

  @Column({ nullable: true })
  gameplayID: string;

  @ManyToOne(() => User, { cascade: true })
  creator: User;

  @OneToMany(() => User, user => user.currentGame)
  @JoinTable()
  players: User[];
}
