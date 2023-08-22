import { Socket } from "socket.io-client";
import SocketManager from "../../SocketManager";
import { Games, IPlayer, IRoom } from "../../types";

interface IGetRoom {
  roomId: string;
}

interface IJoinRoom {
  roomId: string;
}

interface IRoomJoined {
  playerId: string;
  roomId: string;
}

interface ICreateRoom {
  title: string;
  forGame: Games;
}

export default class RoomManager extends SocketManager {
  roomId: string | null;

  constructor(socket: Socket, roomId: string | null = null) {
    super(socket);
    this.roomId = roomId;
  }

  private roomIdNoDefine = new Error("The room Id is not set");

  public async getAllRooms(volatile = false): Promise<IRoom[]> {
    return this.socketRequest<void, IRoom[]>("room:list", null, volatile).then((res) => res.data);
  }

  public async createRoom(data: ICreateRoom): Promise<string> {
    return this.socketRequest<ICreateRoom, IRoomJoined>(
      "room:create",
      data,
    ).then((res) => {
      this.roomId = res.data.roomId;
      return res.data.roomId;
    });
  }

  public async joinRoom(roomId: string): Promise<string> {
    return this.socketRequest<IJoinRoom, IRoomJoined>("room:join", {
      roomId,
    }).then((res) => {
      this.roomId = res.data.roomId;
      return res.data.roomId;
    });
  }

  public async refresh() {
    if (!this.roomId) {
      throw this.roomIdNoDefine;
    }
    return this.socketRequest<IGetRoom, IRoom>("room:get", {
      roomId: this.roomId,
    }).then((res) => res.data);
  }

  public async leaveRoom() {
    if (!this.roomId) {
      throw this.roomIdNoDefine;
    }
    return this.socketRequest("room:leave", { roomId: this.roomId }).then(
      (res: { data: string }) => res.data,
    );
  }

  public onPlayerLeft(callback: () => void) {
    this.subscribeToEvent("room:playerleft", callback);
  }

  public onAdminLeft(callback: () => void) {
    this.subscribeToEvent("room:adminleft", callback);
  }

  public onAdminLeftUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:adminleft");
  }

  public onPlayerJoin(callback: () => void) {
    this.subscribeToEvent("room:playerjoined", callback);
  }

  public onGameStart(callback: () => void) {
    this.subscribeToEvent("room:gamestart", callback);
  }

  public onGameStartUnsubscribe() {
    this.unsubscribeToAllListenersByEvent("cube:gamestart");
  }

  public async amIAdmin(roomAdminId: string): Promise<boolean> {
    return this.getMyProfile().then((player: IPlayer) => player.uuid === roomAdminId);
  }

  public async startGame() {
    return this.socketRequest("room:startgame").then(
      (res: { data: string }) => res.data,
    );
  }
}
