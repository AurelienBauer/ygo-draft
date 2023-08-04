import { v4 as uuidv4 } from "uuid";
import GameRoom, { IRoom } from "./GameRoom";

export interface IPlayer {
  uuid: string;
  socketID: string;
  name: string;
  room?: IRoom;
  connected: boolean;
}

export class Player {
  private player: IPlayer;

  public room: GameRoom | null;

  constructor(name: string, socketID: string) {
    this.player = {
      uuid: uuidv4(),
      socketID,
      name,
      connected: true,
    };
    this.room = null;
  }

  public getId(): string {
    return this.player.uuid;
  }

  public getSocketID(): string {
    return this.player.socketID;
  }

  public getName(): string {
    return this.player.name;
  }

  public getConnected(): boolean {
    return this.player.connected;
  }

  public joinRoom(room: GameRoom) {
    this.room = room;
    this.room.addPlayer(this.player);
  }

  public leaveRoom() {
    if (this.room) {
      this.room.removePlayer(this.player.socketID);
      this.room = null;
    } else {
      throw new Error("You try to leave a room without being in a room");
    }
  }

  public setSocketId(socketId: string) {
    this.player.socketID = socketId;
  }

  public setConnected(isConnected: boolean) {
    this.player.connected = isConnected;
  }
}
