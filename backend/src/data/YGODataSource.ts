import { CardDataSource, CubeDataSource, DataSource } from './interfaces';
import MongoDBCubeDataSource from './mongoDBDataSource/MongoDBCubeDataSource';
import YGOCardDataSource from './ygoProDeckDataSource/YGOCardDataSource';

export default class YGODataSource implements DataSource {
  public cube: CubeDataSource;

  public card: CardDataSource;

  constructor() {
    this.cube = new MongoDBCubeDataSource();
    this.card = new YGOCardDataSource();
  }
}
