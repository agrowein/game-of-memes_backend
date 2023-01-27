import { Document } from "mongoose";

export interface Gameplay extends Document {
  readonly gameId: string;
  readonly ready: {
    userId: string;
    ready: boolean;
  }[];
  readonly stack: string[];
}