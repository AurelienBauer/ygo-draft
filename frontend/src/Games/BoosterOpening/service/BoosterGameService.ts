import { Socket } from "socket.io-client";
import BoosterGameRest from "./BoosterGameRest";
import BoosterGameSocket from "./BoosterGameSocket";

export default class BoosterGameService {
  public rest: BoosterGameRest;

  public socket: BoosterGameSocket;

  constructor(socket: Socket) {
    this.rest = new BoosterGameRest();
    this.socket = new BoosterGameSocket(socket);
  }
}
