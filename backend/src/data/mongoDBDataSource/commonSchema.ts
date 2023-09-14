import mongoose from "mongoose";

// eslint-disable-next-line import/prefer-default-export
export const cardSchema = new mongoose.Schema({
  id: Number,
  uuid: String,
  name: String,
  description: String,
  image_url: String,
  image_small_url: String,
  _type: String,
  attribute: String,
  level: Number,
  frameType: String,
  atk: Number,
  def: Number,
  race: String,
  archetype: String,
  altIds: [{
    type: Number,
    required: false,
  }],
});
