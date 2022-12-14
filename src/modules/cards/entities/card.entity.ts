import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CardType {
  situation = 'situation',
  picture  = 'picture',
}

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CardType,
    default: CardType.picture,
  })
  type: CardType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  picture: string;
}