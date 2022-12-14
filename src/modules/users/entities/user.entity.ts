import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Game } from "../../games/entities/game.entity";

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

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @ManyToOne(() => Game, game => game.creator)
  createdGames: Game[];
}
