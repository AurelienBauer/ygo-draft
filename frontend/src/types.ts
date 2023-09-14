export interface IRoom {
  title: string;
  uuid: string;
  players: IPlayer[];
  adminId: {
    pub: string;
  };
  iAmAdmin?: boolean;
  createdBy: string;
  createdAt: string;
}

export interface IPlayer {
  uuid: string;
  socketID: string;
  name: string;
  room?: IRoom;
  connected: boolean;
}

export interface ICard {
  attribute: string;
  description: string;
  id: string;
  image_small_url: string;
  image_url: string;
  level: number;
  _type: string;
  name: string;
  _id: string;
  uuid: string;
  frameType: string;
  atk?: number;
  def?: number;
  race?: string;
  archetype?: string;
}

export interface IDisconnectionMsg {
  message: "disconnected" | "disconnection_failed";
}

export interface DecksByPlayer {
  player: IPlayer;
  deck: ICard[];
}

export interface ICube {
  _id: string;
  name: string;
  description: string;
  created: Date;
  cards: ICard[];
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

export type Games = "cube" | "booster";

export interface SelectedBooster {
  boosterId: string;
  boosterName: string;
  imageUrl: string;
  number: number;
}

export interface CardFromPack extends ICard {
  rarity: string;
  setcode: string;
  price: string;
}

export interface BoosterOpened {
  id: string;
  name: string;
  cardsLeft: number;
  image_url: string;
  cards: CardFromPack[];
}

export interface CardFromPackOpening extends CardFromPack {
  show: boolean;
  bookMarked: boolean
}

export type Langs = "fr" | "en";

export interface IBuildingDeck {
  deck: ICard[],
  extraDeck: ICard[],
  stock: ICard[],
  bookmarked: ICard[],
}

export type DeckBuilderLoc = "stock" | "deck" | "extraDeck" | "bookmarked";
