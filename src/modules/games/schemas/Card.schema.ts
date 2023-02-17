import { Schema } from "mongoose";

export const CardSchema = new Schema({
  id: String,
  picture: String,
});