import { Schema } from "mongoose";

export const GameplaySchema = new Schema({
  gameId: String,
  ready: [
    {
      userId: String,
      ready: Boolean,
    }
  ],
  stack: [String],
});