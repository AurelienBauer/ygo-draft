export interface DataSource {
  cube: CubeDataSource;
  card: CardDataSource;
}

export interface ICard {
  _id?: string;
  uuid?: string;
  id: number;
  name: string;
  description: string;
  image_url: string;
  image_small_url: string;
  _type?: string;
  attribute?: string;
  level?: number;
  frameType: string;
  atk?: number;
  def?: number;
  race?: string;
  archetype?: string;
}

export interface ICube {
  id?: number;
  name: string;
  cards: ICard[];
  author: string;
  created?: string;
  description: string;
}

export interface IDBCube {
  id?: number;
  name: string;
  encards: ICard[];
  frcards: ICard[];
  author: string;
  created?: string;
  description: string;
}

export interface CubeDataSource {
  getByID(id: string): Promise<IDBCube>;
  getAll(): Promise<IDBCube[]>;
  save(cube: IDBCube): Promise<string>;
}

export interface CardDataSource {
  getByIDs(ids: string[], language?: string): Promise<ICard[]>;
}
