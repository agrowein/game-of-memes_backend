import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Game, game => game.history)
  game: Game;

  stack: [];
}