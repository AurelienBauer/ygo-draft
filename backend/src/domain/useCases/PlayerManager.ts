import RoomManager from "./GameRoomManager";
import { Player } from "./Player";

export default class PlayerManager {
  private playerList: Player[];

  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
    this.playerList = [];
  }

  public createPlayer(name: string, socketID: string): string {
    const p = new Player(name, socketID);
    this.playerList.push(p);
    return p.getId();
  }

  public removePlayer(player: Player) {
    this.playerList = this.playerList.filter(
      (p) => p.getSocketID() !== player.getSocketID(),
    );
    const { room } = player;
    if (room) {
      player.leaveRoom();
      this.roomManager.deleteRoomIfNotPlayerInRoom(room);
    }
  }

  public findPlayer(socketID: string): Player {
    const player = this.playerList.find((p) => p.getSocketID() === socketID);
    if (player) {
      return player;
    }
    throw new Error("Player not found");
  }
}
