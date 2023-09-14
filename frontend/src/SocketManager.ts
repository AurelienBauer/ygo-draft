import { Socket, io } from "socket.io-client";
import { IDisconnectionMsg, IPlayer } from "./types";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "";

export type SCallback<T> = (res: T) => void;

export interface SResponse<D> {
  data: D;
  error?: string;
}

export interface ReconnectionInfo {
  game: string;
  gameCurrentState: string;
}

interface UUID {
  uuid: string;
}

interface ICreateSocket {
  playerName?: string;
  socketId?: string;
}

interface SocketListener {
  event: string;
  callback: SCallback<unknown>;
}

export default class SocketManager {
  protected socket: Socket;

  protected socketID: string;

  private listeners: SocketListener[];

  constructor(socket: Socket) {
    this.socket = socket;
    this.listeners = [];
    // eslint-disable-next-line no-console
    this.socket.io.on("reconnect", () => console.dir("reConnected !!!"));
  }

  protected socketRequest<T, D>(
    event: string,
    body: T | null = null,
    volatile: boolean = false,
  ): Promise<SResponse<D>> {
    return new Promise((resolve, reject) => {
      const responseCb = (res: SResponse<D>) => {
        if (res.error) {
          reject(res);
        }
        resolve(res);
      };
      if (body) {
        if (volatile) {
          this.socket.volatile.emit(event, body, responseCb);
        } else {
          this.socket.emit(event, body, responseCb);
        }
      } else if (volatile) {
        this.socket.volatile.emit(event, responseCb);
      } else {
        this.socket.emit(event, responseCb);
      }
    });
  }

  public async reconnect(socketId: string): Promise<ReconnectionInfo> {
    return this.socketRequest<{ socketId: string }, ReconnectionInfo>(
      "me:reconnect",
      { socketId },
    ).then((res) => res.data);
  }

  public async abordReconnect(socketId: string): Promise<ReconnectionInfo> {
    return this.socketRequest<{ socketId: string }, ReconnectionInfo>(
      "me:abort_reconnect",
      { socketId },
    ).then((res) => res.data);
  }

  public async disconnect(): Promise<IDisconnectionMsg> {
    return this.socketRequest<void, IDisconnectionMsg>("me:disconnect").then(
      (res) => res.data,
    );
  }

  public onConnect(callback: SCallback<Socket>) {
    this.subscribeToEvent("connect", () => callback(this.socket));
  }

  public onDisconnect(callback: SCallback<Socket>) {
    this.subscribeToEvent("disconnect", () => callback(this.socket));
  }

  public onConnectError(callback: SCallback<void>) {
    this.subscribeToEvent("connect_error", () => callback());
  }

  public onPlayerDisconnect(callback: SCallback<UUID>) {
    this.subscribeToEvent("player:disconnect", callback);
  }

  public onPlayerReconnect(callback: SCallback<UUID>) {
    this.subscribeToEvent("player:reconnect", callback);
  }

  public isConnected(): boolean {
    return this.socket.connected;
  }

  public subscribeToEvent<T>(event: string, callback: SCallback<T>) {
    this.socket.on(event, callback);
    this.listeners.push({
      event,
      callback,
    });
  }

  public unsubscribeToAllListenersByEvent(event: string) {
    this.socket.removeAllListeners(event);
  }

  public unsubscribeToAllListeners() {
    this.listeners.forEach((listener) => this.unsubscribeToEvent(listener));
    this.listeners = [];
  }

  private unsubscribeToEvent(listener: SocketListener) {
    this.socket.off(listener.event, listener.callback);
  }

  public async getMyProfile(): Promise<IPlayer> {
    return this.socketRequest("me:profile").then((res: SResponse<IPlayer>) => res.data);
  }

  public static NewSession(playerName: string) {
    return this.CreateSocket({ playerName });
  }

  public static ReconnectSession(socketId: string) {
    return this.CreateSocket({ socketId });
  }

  private static CreateSocket(query: ICreateSocket) {
    return io(URL, {
      query,
    });
  }
}
