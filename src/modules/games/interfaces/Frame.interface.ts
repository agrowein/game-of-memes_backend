import { IPlayer } from "./Player.interface";
import { ISituation } from "./Situation.interface";

export interface IFrame {
  status: string;
  players: IPlayer[];
  ready: Map<string, boolean>;
  situation: ISituation;
  reactions: Map<string, string>;
}