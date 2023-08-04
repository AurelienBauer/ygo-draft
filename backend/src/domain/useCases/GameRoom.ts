import { v4 as uuidv4 } from "uuid";
import { IPlayer, Player } from "./Player";
import Game from "./Game";

export interface IRoom {
  uuid: string;
  title: string;
  createdBy: string;
  createdAt: string;
  adminId: {
    pub: string;
    priv?: string;
  };
  iAmAdmin?: boolean;
  players: IPlayer[];
}

export default class GameRoom {
  private room: IRoom;

  public game: Game;

  constructor(title: string, player: Player, game: Game) {
    this.room = {
      uuid: uuidv4(),
      title,
      createdBy: player.getName(),
      adminId: {
        pub: player.getId(),
        priv: player.getSocketID(),
      },
      players: [],
      createdAt: new Date().toISOString(),
    };

    this.game = game;
  }

  public get(): IRoom {
    return {
      uuid: this.room.uuid,
      title: this.room.title,
      createdBy: this.room.createdBy,
      adminId: {
        pub: this.room.adminId.pub,
      },
      players: this.room.players,
      createdAt: this.room.createdAt,
    };
  }

  public getUUID(): string {
    return this.room.uuid;
  }

  public getPlayers(): IPlayer[] {
    return this.room.players;
  }

  public addPlayer(player: IPlayer) {
    this.room.players.push(player);
  }

  public removePlayer(socketID: string) {
    this.room.players = this.room.players.filter(
      (p) => p.socketID !== socketID,
    );
  }

  public isAdmin(socketID: string) {
    return this.room.adminId.priv === socketID;
  }

  public setGame(game: Game) {
    this.game = game;
  }

  public setAdmin(player: Player) {
    this.room.adminId = {
      pub: player.getId(),
      priv: player.getSocketID(),
    };
  }
}
