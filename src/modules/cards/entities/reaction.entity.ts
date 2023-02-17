import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reactions')
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  picture: string;
}
