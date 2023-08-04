import SocketManager, { SCallback } from "../../../SocketManager";
import { IPlayer } from "../../../types";

export interface ICubeDraftStart {
  cubeID: string;
}

export interface ICubeGame {
  cubeID: string;
  board: string[];
  cubeId: string;
  gameUUID: string;
  playersInGame: { player: IPlayer; deck: string[] }[];
  currentPlayer: string;
  cardsLeftInDeck: number;
}

interface IPlayerPickACard {
  cardUUID: string;
  playerID?: string;
}

export default class CubeGameSocket extends SocketManager {
  public async gameStart(cubeID: string) {
    return this.socketRequest<ICubeDraftStart, ICubeDraftStart>(
      "cube:startdraft",
      { cubeID },
    ).then((res) => res.data);
  }

  public async pickACard(cardUUID: string, volatile = false) {
    return this.socketRequest<IPlayerPickACard, IPlayerPickACard>(
      "cube:pickcard",
      { cardUUID },
      volatile,
    ).then((res) => res.data);
  }

  public async getCurrentGameState() {
    return this.socketRequest<ICubeGame, ICubeGame>("cube:currentinfo").then(
      (res) => res.data,
    );
  }

  public onGameStart(callback: SCallback<ICubeDraftStart>) {
    this.subscribeToEvent<ICubeDraftStart>("cube:draftstarted", callback);
  }

  public onGameStartUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:draftstarted");
  }

  public onCardPicked(callback: SCallback<IPlayerPickACard>) {
    this.subscribeToEvent<IPlayerPickACard>("cube:cardpicked", callback);
  }

  public onCardPickedUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:cardpicked");
  }

  public onNewBoard(callback: SCallback<string[]>) {
    this.subscribeToEvent<string[]>("cube:newboard", callback);
  }

  public onNewBoardUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:newboard");
  }

  public onNextTurn(callback: SCallback<string>) {
    this.subscribeToEvent("cube:nextturn", callback);
  }

  public onNextTurnUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:nextturn");
  }

  public onGameAbord(callback: SCallback<string>) {
    this.subscribeToEvent("game:interrupted", callback);
  }

  public onGameAbordUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:interrupted");
  }

  public onDraftOver(callback: SCallback<string>) {
    this.subscribeToEvent("cube:draft_over", callback);
  }

  public onDraftOverUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:draft_over");
  }
}
