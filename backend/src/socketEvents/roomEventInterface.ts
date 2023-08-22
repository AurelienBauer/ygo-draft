import { IRoom } from "../domain/useCases/GameRoom";
import { Games } from "../types";
import { Response } from "./event";

export interface ICreateRoom {
  title: string;
  forGame: Games;
}

export interface IGetRoom {
  roomId: string;
}

export interface IJoinRoom {
  roomId: string;
}

export interface ILeaveRoom {
  roomId: string;
}

export interface IJoinRoomResponse {
  roomId: string;
}

export interface IRoomServerEvents {
  "room:created": (room: ICreateRoom) => void;
  "room:joined": (roomId: string) => void;
  "room:leaved": (roomId: string) => void;
}

export interface IRoomClientEvents {
  "room:list": (callback: (res: Response<IRoom[]>) => void) => void;

  "room:get": (
    playback: IGetRoom,
    callback: (res: Response<IRoom | undefined>) => void
  ) => void;

  "room:create": (
    playback: ICreateRoom,
    callback: (res: Response<IJoinRoomResponse>) => void
  ) => void;
  "room:join": (
    playback: IJoinRoom,
    callback: (res: Response<IJoinRoomResponse>) => void
  ) => void;
  "room:leave": (
    playback: ILeaveRoom,
    callback: (res: Response<string>) => void
  ) => void;
}
