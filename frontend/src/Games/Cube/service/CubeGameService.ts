import { Socket } from "socket.io-client";
import CubeGameRest from "./CubeGameRest";
import CubeGameSocket from "./CubeGameSocket";
import { ICard } from "../../../types";

export interface ICube {
  _id: string;
  name: string;
  description: string;
  created: Date;
  cards: ICard[];
}

export default class CubeGameService {
  public rest: CubeGameRest;
  public socket: CubeGameSocket;

  constructor(socket: Socket) {
    this.rest = new CubeGameRest();
    this.socket = new CubeGameSocket(socket);
  }
}
