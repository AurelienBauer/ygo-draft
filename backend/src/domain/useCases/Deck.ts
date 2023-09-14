import { ICard } from "../../data/interfaces";

export default class Deck {
  private cards: ICard[];

  private cardsDiscarded: ICard[];

  constructor(cards: ICard[]) {
    this.cards = cards;
    this.cardsDiscarded = [];
  }

  public draw(): ICard {
    if (this.cards.length <= 0) {
      throw new Error("There is not card left in the deck");
    }
    const card = this.cards.pop() as ICard;
    this.cardsDiscarded.push(card);
    return card;
  }

  public withdraw(): ICard {
    if (this.cardsDiscarded.length <= 0) {
      throw new Error("There is not card left in the defauce");
    }
    const card = this.cardsDiscarded.pop() as ICard;
    this.cards.push(card);
    return card;
  }

  public getCardsLeft(): number {
    return this.cards.length;
  }

  public shuffle() {
    this.cards = this.cards
      .map((card) => ({ card, sortValue: Math.random() }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .map((cardObject) => cardObject.card);
  }

  public shuffleDiscardedCards() {
    this.cardsDiscarded = this.cardsDiscarded
      .map((card) => ({ card, sortValue: Math.random() }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .map((cardObject) => cardObject.card);
  }

  public addCard(card: ICard) {
    this.cards.push(card);
  }

  public getCardsUUID(): string[] {
    return this.cards.map((c) => c.uuid as string);
  }

  public getCards(): ICard[] {
    return this.cards;
  }

  public setCards(cards: ICard[]) {
    this.cards = cards;
  }

  public retrieveCard(uuid: string): ICard {
    const card = this.cards.find((c: ICard) => c.uuid === uuid);
    if (!card) {
      throw new Error("Card not found.");
    }
    this.cards = this.cards.filter((c: ICard) => c.uuid !== uuid);
    return card;
  }
}
