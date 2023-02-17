import { Document } from "mongoose";
import { IFrame } from "./Frame.interface";
import { ISituation } from "./Situation.interface";

export interface Gameplay extends Document {
  readonly gameId: string;
  readonly currentRound: IFrame;
  readonly stack: ISituation[];
  readonly rounds: IFrame[];
}