import { v4 as uuidv4 } from "uuid";
import {
  DataSource, IBooster, ICard, IDBBooster,
} from "../../data/interfaces";
import { IBuildingDeckExport, Langs } from "../../types";
import Game from "./Game";
import DeckBuilder, { DeckBuilderLoc, IDeckBuilderAllDeck } from "./DeckBuilder";

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
  boosterLeft: IBooster[];
}

export default class BoosterGame extends Game {
  private ds: DataSource;

  private boosters: IDBBooster[];

  private openedBoosters: IDBBooster[];

  private deckBuilder: DeckBuilder;

  constructor(datasource: DataSource) {
    super("booster");
    this.ds = datasource;
    this.boosters = [];
    this.openedBoosters = [];
    this.deckBuilder = new DeckBuilder();
  }

  public async setBoosterByIDs(ids: string[]) {
    this.boosters = await Promise.all(
      ids.map((id) => this.ds.booster.getByID(id)),
    );
  }

  public startOpening() {
    this.changeGameState("start_opening");
  }

  public startBuilding() {
    this.changeGameState("start_building");
  }

  public async open(lang: Langs): Promise<BoosterOpened> {
    if (this.boosters.length === 0) {
      throw new Error("There is no boosters left");
    }
    const booster = this.boosters.pop();
    if (!booster) {
      throw new Error("Booster not found");
    }
    const cardsFromPack = await this.ds.pack.openPack(booster.pack_opener_link);
    const cards = lang === "fr" ? booster.frcards : booster.encards;

    this.openedBoosters.push(booster);
    const cardsToReturn = cardsFromPack.map((cfp) => {
      let card = cards.find((c) => c.id === cfp.id);
      if (!card) {
        card = cards.find((c) => c.altIds?.includes(cfp.id));
        if (!card) {
          throw new Error(`Card with the id: ${cfp.id} not found`);
        }
      }
      card.uuid = uuidv4();
      this.deckBuilder.addToStock(card);

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
      name: lang === "fr" && booster.name_fr ? booster.name_fr : booster.name,
      image_url: booster.image_url,
      cardsLeft: this.boosters.length,
      cards: cardsToReturn,
      boosterLeft: this.boosters.map((b) => ({
        id: uuidv4(),
        name: b.name,
        name_fr: b.name_fr,
        alias: b.alias,
        image_url: b.image_url,
        pack_opener_link: b.pack_opener_link,
        region: b.region,
        release_date: b.release_date,
      })),
    };
  }

  public async deckImport(deck: IBuildingDeckExport, lang: Langs) {
    const cards = await this.ds.card.getByIDs(
      [...deck.deck, ...deck.extraDeck, ...deck.bookmarked, ...deck.stock],
      lang,
    );

    const storeCards = (cardsID: number[], addToBuilder: (c :ICard) => void) => {
      cardsID.forEach((bCardID) => {
        const card = cards.find((c) => c.id === bCardID);
        if (!card) {
          throw new Error(`Card with the id: ${bCardID} not found`);
        }
        card.uuid = uuidv4();
        addToBuilder({ ...card });
      });
    };

    storeCards(deck.deck, (c) => this.deckBuilder.addToDeck(c));
    storeCards(deck.extraDeck, (c) => this.deckBuilder.addToExtraDeck(c));
    storeCards(deck.bookmarked, (c) => this.deckBuilder.addToBooked(c));
    storeCards(deck.stock, (c) => this.deckBuilder.addToStock(c));
  }

  public moveCardByUUID(uuid: string, from: DeckBuilderLoc, to: DeckBuilderLoc) {
    this.deckBuilder.moveCardByUUID(uuid, from, to);
  }

  public getAllDeckBuilding(): IDeckBuilderAllDeck {
    return this.deckBuilder.getAllDecks();
  }
}
