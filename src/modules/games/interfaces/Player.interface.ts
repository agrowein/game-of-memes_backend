import { ICard } from "./Card.interface";

export interface IPlayer {
  id: string;
  cards: ICard[];
  nickname: string;
  avatarURL?: string;
}