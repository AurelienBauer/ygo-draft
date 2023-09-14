export interface DataSource {
  cube: CubeDataSource;
  card: CardDataSource;
  pack: PackDataSource;
  booster: BoosterDataSource;
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
  altIds?: number[];
  bookmarked?: boolean;
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
  getByCardset(cardset: string, language?: string): Promise<ICard[]>;
}

export interface IDBBooster {
  _id?: string;
  name: string;
  name_fr?: string;
  image_url: string;
  release_date: Date;
  region: string;
  alias: string;
  encards: ICard[];
  frcards: ICard[];
  pack_opener_link: string;
}

export interface IBooster {
  id: string;
  name: string;
  name_fr?: string;
  image_url: string;
  release_date: Date;
  region: string;
  alias: string;
  pack_opener_link: string;
}

export interface Pack {
  name: string;
  name_fr?: string;
  code: string;
  img_code: string;
  release_date: string;
  region: string;
  alias: string;
  release_date_pretty: string;
  pack_opener_link?: string;
}

export interface IPackCard {
  id: number;
  rarity: string;
  setcode: string;
  price: string;
}

export interface BoosterDataSource {
  save(booster: IDBBooster): Promise<string>;
  getAll(): Promise<IDBBooster[]>;
  getByID(id: string): Promise<IDBBooster>;
}

export interface PackDataSource {
  openPack(url: string): Promise<IPackCard[]>;
  fetchPacks(): Pack[];
}
