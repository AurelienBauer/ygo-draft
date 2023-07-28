import { IDBCube, DataSource, ICard } from "../../data/interfaces";
import Deck from "./Deck";
import Game from "./Game";
import { IPlayer } from "./Player";

export interface InGamePlayer {
  player: IPlayer;
  deck: Deck;
}

export interface ExportInGamePlayer {
  player: IPlayer;
  deck: string[];
}

export interface ICubeGame {
  cubeID: string;
  board: ICard[];
  playersInGame: ExportInGamePlayer[];
  currentPlayer: string;
  cardsLeftInDeck: number;
}

export default class CubeGame extends Game {
  private selectedDeck: Deck | null;
  private ds: DataSource;
  private board: ICard[];
  private playersInGame: InGamePlayer[];
  private startTheRoundIndex: number;
  private currentPlayerIndex: number;
  private cubeID: string;

  constructor(datasource: DataSource) {
    super("cube");
    this.ds = datasource;
    this.selectedDeck = null;
    this.board = [];
    this.playersInGame = [];
    this.startTheRoundIndex = 0;
    this.currentPlayerIndex = 0;
    this.cubeID = "undefined";
  }

  public draw(): ICard {
    if (!this.selectedDeck) {
      throw new Error("There is no deck selected");
    }
    const card = this.selectedDeck.draw();
    this.newAction({
      action: `Systhem draw a card: ${card.name}(${card.id})`,
    });
    return card;
  }

  public async loadCube(cubeID: string) {
    const cube: IDBCube = await this.ds.cube.getByID(cubeID);
    this.selectedDeck = new Deck(cube.encards);
    this.selectedDeck.shuffle();
    this.changeGameState("draft_start");
  }

  public drawNCards(n: number) {
    for (let i = 0; i < n; i++) {
      this.board.push(this.draw());
    }
  }

  public init(players: IPlayer[], cubeID: string) {
    this.cubeID = cubeID;
    this.playersInGame = players.map((p) => ({
      player: p,
      deck: new Deck([]),
    }));
    this.currentPlayerIndex =
      Math.floor(Math.random()) % this.playersInGame.length;
    this.startTheRoundIndex = this.currentPlayerIndex;
  }

  public playerPickACard(playerUUID: string, cardUUID: string): string {
    const card = this.board.find((c) => c.uuid?.toString() === cardUUID);
    if (!card) {
      throw new Error(`Cannot find the card: ${cardUUID} on the board`);
    }

    const currentPlayer = this.playersInGame[this.currentPlayerIndex];
    if (currentPlayer.player.uuid !== playerUUID) {
      throw new Error(`It is not the turn of player ${playerUUID}`);
    }

    currentPlayer.deck.addCard(card);
    this.board = this.board.filter((c) => c.uuid?.toString() !== cardUUID);
    this.newAction({
      action: `${currentPlayer.player.name} picked the card: ${card.name}(${card.id})`,
    });
    return card?.uuid || "";
  }

  public nextTurn(): string {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.playersInGame.length;
    return this.playersInGame[this.currentPlayerIndex].player.uuid;
  }

  public nextRound(): string {
    this.startTheRoundIndex =
      (this.startTheRoundIndex + 1) % this.playersInGame.length;
    this.currentPlayerIndex = this.startTheRoundIndex;
    return this.playersInGame[this.currentPlayerIndex].player.uuid;
  }

  public getBoard(): ICard[] {
    return this.board;
  }

  public clearBoard() {
    this.board.forEach((c) => this.selectedDeck?.addCard(c));
    this.selectedDeck?.shuffle();
    this.board = [];
  }

  public getInfo(): ICubeGame {
    return {
      cubeID: this.cubeID,
      board: this.board,
      playersInGame: this.playersInGame.map((pig) => ({
        player: pig.player,
        deck: pig.deck.getCardsUUID(),
      })),
      currentPlayer: this.playersInGame[this.currentPlayerIndex].player.uuid,
      cardsLeftInDeck: this.getCardsLeft(),
    };
  }

  public getCardsLeft(): number {
    return this.selectedDeck?.getCardsLeft() ?? 0;
  }
}
