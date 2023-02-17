import { Schema } from "mongoose";

export const SituationSchema = new Schema({
  id: String,
  text: String,
})