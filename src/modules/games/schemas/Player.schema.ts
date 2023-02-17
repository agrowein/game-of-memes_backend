import { Schema } from "mongoose";
import { CardSchema } from "./Card.schema";

export const PlayerSchema = new Schema({
  id: String,
  cards: [CardSchema],
})