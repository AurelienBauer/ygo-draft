/* eslint-disable class-methods-use-this */
import { Socket } from "socket.io";
import { Callback, ILangs } from "./event";
import { DataSource } from "../data/interfaces";
import BoosterGame, { BoosterOpened } from "../domain/useCases/BoosterGame";
import { DeckBuilderLoc, IDeckBuilderAllDeck } from "../domain/useCases/DeckBuilder";
import { IBuildingDeckExportInfo } from "../types";

interface IStartOpening {
  boosterId: string;
  number: number;
}

interface IMoveCardDeckBuilder {
  uuid: string;
  from: DeckBuilderLoc;
  to: DeckBuilderLoc;
}

export default class BoosterGameEventsHandler {
  constructor(private ds: DataSource) {}

  private static getGame(socket: Socket): BoosterGame {
    const { player } = socket.data;
    if (!player.room) {
      throw new Error("Room is undefined");
    }
    if (!player.room.game) {
      throw new Error("Game is undefined");
    }
    return player.room.game as BoosterGame;
  }

  public startOpening(
    socket: Socket,
    playback: { boosters: IStartOpening[] },
    callback: Callback<string>,
  ) {
    const game = BoosterGameEventsHandler.getGame(socket);

    const boosterIDs: string[] = playback.boosters.flatMap(
      (booster) => Array(booster.number).fill(booster.boosterId),
    );
    game.setBoosterByIDs(boosterIDs).then(() => {
      game.startOpening();
      callback({ data: "start_opening" });
    });
  }

  public openNextBooster(
    socket: Socket,
    playback: ILangs,
    callback: Callback<BoosterOpened>,
  ) {
    const game = BoosterGameEventsHandler.getGame(socket);

    game
      .open(playback.lang)
      .then((cards) => {
        callback({ data: cards });
      })
      .catch((err) => {
        callback({ error: err, errorDetails: err.toString() });
      });
  }

  public loadExtraCard(
    socket: Socket,
    playback: IBuildingDeckExportInfo,
    callback: Callback<string>,
  ) {
    const game = BoosterGameEventsHandler.getGame(socket);

    game.deckImport(playback.export, playback.lang).then(() => callback({ data: "Deck imported" }));
  }

  public moveCard(
    socket: Socket,
    playback: IMoveCardDeckBuilder,
    callback: Callback<string>,
  ) {
    const { uuid, from, to } = playback;
    const game = BoosterGameEventsHandler.getGame(socket);

    game.moveCardByUUID(uuid, from, to);
    callback({ data: `Card moved from "${from}" to "${to}"` });
  }

  public startDeckBuilding(socket: Socket, callback: Callback<string>) {
    const game = BoosterGameEventsHandler.getGame(socket);

    game.startBuilding();
    callback({ data: "start_building" });
  }

  public deckBuildingCurrentState(
    socket: Socket,
    callback: Callback<IDeckBuilderAllDeck>,
  ) {
    const game = BoosterGameEventsHandler.getGame(socket);
    callback({
      data: game.getAllDeckBuilding(),
    });
  }
}
