import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Card } from "../../cards/entities/card.entity";

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @OneToMany(() => User, user => user.createdGames)
  creator: User;

  @ManyToOne(() => User)
  @JoinTable()
  players: User[];

  @ManyToMany(() => Card)
  @JoinTable()
  pictures: Card[];

  @ManyToMany(() => Card)
  @JoinTable()
  situations: Card[];
}
