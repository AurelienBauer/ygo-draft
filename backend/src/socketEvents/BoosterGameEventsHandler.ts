/* eslint-disable class-methods-use-this */
import { Socket } from "socket.io";
import { Callback, ILangs } from "./event";
import { DataSource } from "../data/interfaces";
import BoosterGame, { BoosterOpened } from "../domain/useCases/BoosterGame";

interface IStartOpening {
  boosterId: string;
  number: number;
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
    game.setBoosterIDs(boosterIDs);
    game.startOpening();
    callback({ data: "start_opening" });
  }

  public openNextBooster(
    socket: Socket,
    playback: ILangs,
    callback: Callback<BoosterOpened>,
  ) {
    const game = BoosterGameEventsHandler.getGame(socket);

    game.open(playback.lang).then((cards) => {
      callback({ data: cards });
    });
  }
}
