import { Socket } from "socket.io";
import { IPlayer, Player } from "../domain/useCases/Player";
import { Callback } from "./event";
import PlayerManager from "../domain/useCases/PlayerManager";
import { Logger } from "winston";

interface IDisconnectionMsg {
  message: "disconnected" | "disconnection_failed";
}

interface SocketId {
  socketId: string;
}

interface ReconnectionInfo {
  game: string;
  gameCurrentState: string;
}

export default class PlayerEventsHandler {
  private playerManager: PlayerManager;
  private logger: Logger;

  constructor(playerManager: PlayerManager, logger: Logger) {
    this.playerManager = playerManager;
    this.logger = logger;
  }

  public getMyProfile(socket: Socket, callback: Callback<IPlayer>): void {
    const player: Player = socket.data.player;
    const room = player.room ? player?.room.get() : undefined;
    if (room) {
      room.iAmAdmin = player.room?.isAdmin(player.getSocketID());
    }
    callback({
      data: {
        name: player.getName(),
        uuid: player.getId(),
        socketID: player.getSocketID(),
        room: room,
        connected: player.getConnected(),
      },
    });
  }

  public disconnect(socket: Socket): void {
    const player: Player = socket.data.player;
    this.logger.info(
      `Client disconnected. Player name: ${
        player ? player.getName() : "undefined"
      }`
    );
    if (player) {
      player.setConnected(false);
      if (player.room) {
        socket
          .to(`room:${player.room?.getUUID()}`)
          .emit("player:disconnect", { uuid: player.getId() });
      }
    }
  }

  public deepDisconnect(
    socket: Socket,
    callback: Callback<IDisconnectionMsg>
  ): void {
    const player: Player = socket.data.player;
    if (player) {
      if (player.room) {
        if (player.room.game) {
          player.room.game.changeGameState("game_interrupted");
          socket.data.io
            .to(`room:${player.room?.getUUID()}`)
            .emit("game:interrupted");
        }
        socket.leave(`room:${player.room.getUUID()}`);
        if (
          player.room.isAdmin(player.getSocketID()) &&
          player.room.getPlayers().length
        ) {
          socket.to(`room:${player.room.getUUID()}`).emit("room:adminleft");
        }
        socket.to(`room:${player.room.getUUID()}`).emit("room:playerleft");
      }
      this.playerManager.removePlayer(player);
      callback({
        data: { message: "disconnected" },
      });
    } else {
      callback({
        data: { message: "disconnection_failed" },
      });
    }
  }

  public abortReconnect(
    socket: Socket,
    playback: SocketId,
    callback: Callback<IDisconnectionMsg>
  ): void {
    const { socketId } = playback;
    const player = this.playerManager.findPlayer(socketId);
    socket.data.player = player;
    this.deepDisconnect(socket, callback);
  }

  public reconnect(
    socket: Socket,
    playback: SocketId,
    callback: Callback<ReconnectionInfo | {}>
  ): void {
    const { socketId } = playback;

    const player = this.playerManager.findPlayer(socketId);
    player.setConnected(true);
    player.setSocketId(socket.id);
    let data = {};
    if (player.room) {
      data = {
        game: player.room.game.getName(),
        gameCurrentState: player.room.game.getStage(),
      };

      if (player.room.isAdmin(socketId)) {
        player.room.setAdmin(player);
      }
      socket.join(`room:${player.room.getUUID()}`);
      socket
        .to(`room:${player.room.getUUID()}`)
        .emit("player:reconnect", { uuid: player.getId() });
    }

    callback({
      data,
    });
  }
}
