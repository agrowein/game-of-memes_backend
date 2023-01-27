import {
  Column,
  Entity,
  ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Game } from '../../games/entities/game.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column()
  refreshToken: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @ManyToOne(() => Game, game => game.players)
  currentGame: Game;

  @Column({ nullable: true })
  lastSockedId: string;
}
