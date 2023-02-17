import { Schema } from "mongoose";
import { FrameSchema } from "./Frame.schema";
import { SituationSchema } from "./Situation.schema";

export const GameplaySchema = new Schema({
  gameId: String,
  currentRound: FrameSchema,
  stack: [SituationSchema],
  rounds: [FrameSchema],
});