import { Player } from "./Player";
import GameRoom from "./GameRoom";
import Game from "./Game";

export default class RoomManager {
  private roomsList: GameRoom[];

  constructor() {
    this.roomsList = [];
  }

  public createNewRoom(title: string, player: Player, game: Game): GameRoom {
    const room = new GameRoom(title, player, game);
    this.roomsList.push(room);
    return room;
  }

  public getRoomById(uuid: string): GameRoom {
    const room = this.roomsList.find((room) => room.getUUID() === uuid);
    if (!room) {
      throw new Error(`The room with id "${uuid}" does not exist.`);
    }
    return room;
  }

  public getRooms(): GameRoom[] {
    return this.roomsList;
  }

  public getRoomsNotInGame(): GameRoom[] {
    return this.roomsList.filter((r) => r.game.getStage() === "room");
  }

  public deleteRoomById(uuid: string) {
    this.roomsList = this.roomsList.filter((room) => room.getUUID() !== uuid);
  }

  public deleteRoomIfNotPlayerInRoom(room: GameRoom) {
    if (room.getPlayers().length === 0) {
      this.deleteRoomById(room.getUUID());
    }
  }
}
