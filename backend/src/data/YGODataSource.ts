import {
  BoosterDataSource,
  CardDataSource,
  CubeDataSource,
  DataSource,
  PackDataSource,
} from "./interfaces";
import MongoDBBoosterDataSource from "./mongoDBDataSource/MongoDBBoosterDataSource";
import MongoDBCubeDataSource from "./mongoDBDataSource/MongoDBCubeDataSource";
import YGOCardDataSource from "./ygoProDeckDataSource/YGOCardDataSource";
import YGOPackDataSource from "./ygoProDeckDataSource/YGOPackDataSource";

export default class YGODataSource implements DataSource {
  public cube: CubeDataSource;

  public card: CardDataSource;

  public pack: PackDataSource;

  public booster: BoosterDataSource;

  constructor() {
    this.cube = new MongoDBCubeDataSource();
    this.card = new YGOCardDataSource();
    this.pack = new YGOPackDataSource();
    this.booster = new MongoDBBoosterDataSource();
  }
}
