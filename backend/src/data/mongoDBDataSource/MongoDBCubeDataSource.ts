import mongoose, { Model } from "mongoose";
import { CubeDataSource, IDBCube } from "../interfaces";

const cardSchema = new mongoose.Schema({
  id: String,
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
});

const cubeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  encards: [cardSchema],
  frcards: [cardSchema],
  author: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default class MongoDBCubeDataSource implements CubeDataSource {
  private cube: Model<IDBCube>;

  constructor() {
    this.cube = mongoose.model<IDBCube>("Cubes", cubeSchema);
  }

  public async getByID(id: string): Promise<IDBCube> {
    const result = await this.cube.findById(id).exec();
    if (!result) {
      throw new Error("Cube not found");
    }
    return result;
  }

  public async getAll(): Promise<IDBCube[]> {
    const result = await this.cube.find().limit(100).exec();
    if (!result) {
      throw new Error("Cube not found");
    }
    return result;
  }

  public async save(cube: IDBCube): Promise<string> {
    const result = await this.cube.create(cube);
    // eslint-disable-next-line no-underscore-dangle
    return result._id.toString();
  }
}
