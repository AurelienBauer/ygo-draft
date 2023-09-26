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

  private static hasReachNumberLimit(card: ICard, deck: Deck) {
    const cards = deck.getCards();
    return cards.filter((c) => card.id === c.id).length >= 3;
  }

  public addToDeck(c: ICard) {
    this.deck.addCard(c);
  }

  public addToExtraDeck(c: ICard) {
    if (DeckBuilder.hasReachNumberLimit(c, this.extraDeck)) {
      throw new Error("The maximum number for this card has been reached");
    }
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

  private getDeckByLoc(loc: DeckBuilderLoc): Deck {
    switch (loc) {
      case "deck":
        return this.deck;
      case "extraDeck":
        return this.extraDeck;
      case "stock":
        return this.stock;
      case "bookmarked":
        return this.bookmarked;
      default:
        throw new Error("Deck not found");
    }
  }

  public moveCardByUUID(uuid: string, from: DeckBuilderLoc, to: DeckBuilderLoc) {
    const fromDeck = this.getDeckByLoc(from);
    const toDeck = this.getDeckByLoc(to);

    const card: ICard = fromDeck.retrieveCard(uuid);
    if ((to === "deck" || to === "extraDeck") && DeckBuilder.hasReachNumberLimit(card, toDeck)) {
      fromDeck.addCard(card);
      throw new Error("The maximum number for this card has been reached");
    }

    toDeck.addCard(card);
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
