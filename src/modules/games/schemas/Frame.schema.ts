import { Schema } from "mongoose";
import { SituationSchema } from "./Situation.schema";
import { PlayerSchema } from "./Player.schema";

export const FrameSchema = new Schema({
  status: String,
  players: {
    type: Array,
    of: PlayerSchema,
  },
  ready: {
    type: Map,
    of: Boolean,
  },
  situation: {
    type: SituationSchema,
    require: true,
  },
  reactions: {
    type: Map,
    of: String,
  }
});