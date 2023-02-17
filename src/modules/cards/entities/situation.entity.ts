import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('situations')
export class Situation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  text: string;
}