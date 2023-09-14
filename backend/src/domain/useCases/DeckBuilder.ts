import { ICard } from "../../data/interfaces";
import Deck from "./Deck";

export type DeckBuilderLoc = "deck" | "extraDeck" | "stock" | "bookmarked";

export interface IDeckBuilderAllDeck {
  deck: ICard[],
  extraDeck: ICard[],
  stock: ICard[],
  bookmarked: ICard[],
}

export default class DeckBuilder {
  private deck: Deck;

  private extraDeck: Deck;

  private stock: Deck;

  private bookmarked: Deck;

  constructor() {
    this.deck = new Deck([]);
    this.extraDeck = new Deck([]);
    this.stock = new Deck([]);
    this.bookmarked = new Deck([]);
  }

  public addToDeck(c: ICard) {
    this.deck.addCard(c);
  }

  public addToExtraDeck(c: ICard) {
    this.extraDeck.addCard(c);
  }

  public addToStock(c: ICard) {
    this.stock.addCard(c);
  }

  public addToBooked(c: ICard) {
    this.bookmarked.addCard(c);
  }

  public getDeck(): Deck {
    return this.deck;
  }

  public getExtraDeck(): Deck {
    return this.extraDeck;
  }

  public getStock(): Deck {
    return this.stock;
  }

  public getBookmarked(): Deck {
    return this.bookmarked;
  }

  private getCardByUUIDByLocation(uuid: string, loc: DeckBuilderLoc): ICard {
    switch (loc) {
      case "deck":
        return this.deck.retrieveCard(uuid);
      case "extraDeck":
        return this.extraDeck.retrieveCard(uuid);
      case "stock":
        return this.stock.retrieveCard(uuid);
      case "bookmarked":
        return this.bookmarked.retrieveCard(uuid);
      default:
        throw new Error(`Location "${loc}" not found`);
    }
  }

  private addCardToLocation(card: ICard, loc: DeckBuilderLoc) {
    switch (loc) {
      case "deck":
        this.deck.addCard(card);
        break;
      case "extraDeck":
        this.extraDeck.addCard(card);
        break;
      case "stock":
        this.stock.addCard(card);
        break;
      case "bookmarked":
        this.bookmarked.addCard(card);
        break;
      default:
        break;
    }
  }

  public moveCardByUUID(uuid: string, from: DeckBuilderLoc, to: DeckBuilderLoc) {
    const card: ICard = this.getCardByUUIDByLocation(uuid, from);
    this.addCardToLocation(card, to);
  }

  public getAllDecks(): IDeckBuilderAllDeck {
    return {
      deck: this.deck.getCards(),
      extraDeck: this.extraDeck.getCards(),
      bookmarked: this.bookmarked.getCards(),
      stock: this.stock.getCards(),
    };
  }
}
