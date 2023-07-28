import { Socket } from "socket.io";
import RoomManager from "../domain/useCases/GameRoomManager";
import {
  ICreateRoom,
  ILeaveRoom,
  IJoinRoomResponse,
  IJoinRoom,
  IGetRoom,
} from "./roomEventInterface";
import { IRoom } from "../domain/useCases/GameRoom";
import CubeGame from "../domain/useCases/CubeGame";
import { Player } from "../domain/useCases/Player";
import { DataSource } from "../data/interfaces";
import { Callback } from "./event";

export default class RoomEventsHandler {
  private roomManager: RoomManager;
  private ds: DataSource;

  constructor(roomManager: RoomManager, ds: DataSource) {
    this.roomManager = roomManager;
    this.ds = ds;
  }

  public listRoom(socket: Socket, callback: Callback<IRoom[]>): void {
    const rooms: IRoom[] = this.roomManager
      .getRoomsNotInGame()
      .map((gameroom) => gameroom.get());
    callback({ data: rooms });
  }

  public getRoom(
    socket: Socket,
    playback: IGetRoom,
    callback: Callback<IRoom | undefined>
  ): void {
    const room: IRoom | undefined = this.roomManager
      .getRoomById(playback.roomId)
      ?.get();
    callback({ data: room });
  }

  public createRoom(
    socket: Socket,
    playback: ICreateRoom,
    callback: Callback<IJoinRoomResponse>
  ): void {
    const player: Player = socket.data.player;
    const room = this.roomManager.createNewRoom(
      playback.title,
      player,
      new CubeGame(this.ds)
    );
    player.joinRoom(room);
    socket.join(`room:${room.getUUID()}`);
    callback({
      data: {
        roomId: room.getUUID(),
      },
    });
  }

  public joinRoom(
    socket: Socket,
    playback: IJoinRoom,
    callback: Callback<IJoinRoomResponse>
  ): void {
    const player: Player = socket.data.player;
    const room = this.roomManager.getRoomById(playback.roomId);

    player.joinRoom(room);
    socket.join(`room:${playback.roomId}`);

    socket.to(`room:${playback.roomId}`).emit("room:playerjoined");
    callback({
      data: {
        roomId: room.getUUID(),
      },
    });
  }

  public leaveRoom(
    socket: Socket,
    playback: ILeaveRoom,
    callback: Callback<string>
  ): void {
    const player: Player = socket.data.player;
    const gameRoom = player.room;
    if (gameRoom) {
      if (
        gameRoom.isAdmin(player.getSocketID()) &&
        gameRoom.getPlayers().length
      ) {
        socket.to(`room:${playback.roomId}`).emit("room:adminleft");
      }
      player.leaveRoom();
      this.roomManager.deleteRoomIfNotPlayerInRoom(gameRoom);
      socket.leave(`room:${gameRoom.getUUID()}`);
      socket.to(`room:${gameRoom.getUUID()}`).emit("room:playerleft");
      callback({ data: "You left the room" });
    } else {
      callback({ data: "This room does not exits" });
    }
  }

  public startGame(socket: Socket, callback: Callback<string>) {
    const player: Player = socket.data.player;
    if (player.room?.isAdmin(socket.id)) {
      socket.to(`room:${player.room.getUUID()}`).emit("room:gamestart");
      player.room.game.changeGameState("game_start");
      callback({ data: "You start the game" });
    } else {
      callback({
        data: "You are not admin of this room, you cannot start the game",
      });
    }
  }
}
