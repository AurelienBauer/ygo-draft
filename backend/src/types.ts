import { ICard } from "./data/interfaces";

export type Games = "cube" | "booster";

export type Langs = "fr" | "en";

export interface IDeck {
  cards: ICard[]
  length: number;
}
