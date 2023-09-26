import { ICard } from "./data/interfaces";

export type Games = "cube" | "booster";

export type Langs = "fr" | "en";

export interface IDeck {
  cards: ICard[]
  length: number;
}

export interface IBuildingDeckExport {
  deck: number[],
  extraDeck: number[],
  stock: number[],
  bookmarked: number[],
}

export interface IBuildingDeckExportInfo {
  lang: Langs,
  export: IBuildingDeckExport,
}
