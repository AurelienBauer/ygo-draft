import { Socket } from "socket.io-client";
import SocketManager from "../../SocketManager";
import { IPlayer, IRoom } from "../../types";

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
}

export default class RoomManager extends SocketManager {
  roomId: string | null;

  constructor(socket: Socket, roomId: string | null = null) {
    super(socket);
    this.roomId = roomId;
  }

  private roomIdNoDefine = new Error("The room Id is not set");

  public async getAllRooms(): Promise<IRoom[]> {
    return this.socketRequest<void, IRoom[]>("room:list").then((res) => {
      return res.data;
    });
  }

  public async createRoom(data: ICreateRoom): Promise<string> {
    return this.socketRequest<ICreateRoom, IRoomJoined>(
      "room:create",
      data
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
    }).then((res) => {
      return res.data;
    });
  }

  public async leaveRoom() {
    if (!this.roomId) {
      throw this.roomIdNoDefine;
    }
    return this.socketRequest("room:leave", { roomId: this.roomId }).then(
      (res: { data: string }) => res.data
    );
  }

  public onPlayerLeft(callback: () => void) {
    this.subscribeToEvent("room:playerleft", callback);
  }

  public onAdminLeft(callback: () => void) {
    this.subscribeToEvent("room:adminleft", callback);
  }

  public onPlayerJoin(callback: () => void) {
    this.subscribeToEvent("room:playerjoined", callback);
  }

  public onGameStart(callback: () => void) {
    this.subscribeToEvent("room:gamestart", callback);
  }

  public async amIAdmin(roomAdminId: string): Promise<boolean> {
    return this.getMyProfile().then((player: IPlayer) => {
      return player.uuid === roomAdminId;
    });
  }

  public async startGame() {
    return this.socketRequest("room:startgame").then(
      (res: { data: string }) => res.data
    );
  }
}
