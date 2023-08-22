import { DataSource, ICard } from "../../data/interfaces";
import { Langs } from "../../types";
import Deck from "./Deck";
import Game from "./Game";

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

export default class BoosterGame extends Game {
  private ds: DataSource;

  private boosterIDs: string[];

  private openedBoosterIds: string[];

  private deck: Deck;

  private stock: Deck;

  constructor(datasource: DataSource) {
    super("booster");
    this.ds = datasource;
    this.boosterIDs = [];
    this.openedBoosterIds = [];
    this.stock = new Deck([]);
    this.deck = new Deck([]);
  }

  public setBoosterIDs(ids: string[]) {
    this.boosterIDs = ids;
  }

  public startOpening() {
    this.changeGameState("start_opening");
  }

  public async open(lang: Langs): Promise<BoosterOpened> {
    if (this.boosterIDs.length === 0) {
      throw new Error("There is no boosters left");
    }
    const id = this.boosterIDs.pop();
    if (!id) {
      throw new Error("Booster not found");
    }
    const booster = await this.ds.booster.getByID(id);
    const cardsFromPack = await this.ds.pack.openPack(
      booster.pack_opener_link,
    );
    const cards = lang === "fr" ? booster.frcards : booster.encards;

    this.openedBoosterIds.push(id);
    const cardsToReturn = cardsFromPack.map((cfp) => {
      const card = cards.find((c) => c.id === cfp.id);
      if (!card) {
        throw new Error(`Card with the id: ${cfp.id} not found`);
      }
      this.stock.addCard(card);

      return {
        ...card,
        rarity: cfp.rarity,
        setcode: cfp.setcode,
        price: cfp.price,
      };
    });

    return {
      // eslint-disable-next-line no-underscore-dangle
      id: booster._id ?? "",
      name: (lang === "fr" && booster.name_fr) ? booster.name_fr : booster.name,
      image_url: booster.image_url,
      cardsLeft: this.boosterIDs.length,
      cards: cardsToReturn,
    };
  }
}
