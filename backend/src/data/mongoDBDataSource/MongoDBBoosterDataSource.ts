import mongoose, { Model } from "mongoose";
import { cardSchema } from "./commonSchema";
import { BoosterDataSource, IDBBooster } from "../interfaces";

const boosterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  name_fr: {
    type: String,
    required: false,
    default: null,
  },
  region: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  pack_opener_link: {
    type: String,
    required: true,
  },
  encards: [cardSchema],
  frcards: [cardSchema],
  release_date: {
    type: Date,
    default: Date.now,
  },
});

export default class MongoDBBoosterDataSource implements BoosterDataSource {
  private booster: Model<IDBBooster>;

  constructor() {
    this.booster = mongoose.model<IDBBooster>("Booster", boosterSchema);
  }

  public async save(booster: IDBBooster): Promise<string> {
    const result = await this.booster.create(booster);
    // eslint-disable-next-line no-underscore-dangle
    return result._id.toString();
  }

  public async getAll(): Promise<IDBBooster[]> {
    const result = await this.booster.find().limit(100).exec();
    if (!result) {
      throw new Error("Fail fetching all boosters");
    }
    return result;
  }

  public async getByID(id: string): Promise<IDBBooster> {
    const result = await this.booster.findById(id).exec();
    if (!result) {
      throw new Error("Booster not found");
    }
    return result.toObject();
  }
}
