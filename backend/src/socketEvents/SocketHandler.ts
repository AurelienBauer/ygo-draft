import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Logger } from "winston";
import { DataSource } from "../data/interfaces";
import RoomManager from "../domain/useCases/GameRoomManager";
import PlayerManager from "../domain/useCases/PlayerManager";
import PlayerEventsHandler from "./PlayerEventsHandler";
import RoomEventsHandler from "./RoomEventsHandler";
import CubeGameEventsHandler from "./CubeGameEventsHandler";
import { Callback } from "./event";

/// try/catch
const tc = <T>(tryFunc: () => T, catchFunc: (e: Error) => T) => {
  let val: T;
  try {
    val = tryFunc();
  } catch (e) {
    val = catchFunc(e as Error);
  }
  return val;
};

type EventHandler = (...args: unknown[]) => unknown;

export default class SocketHandler {
  private roomManager: RoomManager;

  private playerManager: PlayerManager;

  private logger: Logger;

  private io: Server;

  private playerEventsHandler: PlayerEventsHandler;

  private roomEventsHandler: RoomEventsHandler;

  private cubeGameEventsHandler: CubeGameEventsHandler;

  constructor(httpServer: HttpServer, ds: DataSource, logger: Logger) {
    this.logger = logger;
    this.roomManager = new RoomManager();
    this.playerManager = new PlayerManager(this.roomManager);

    this.playerEventsHandler = new PlayerEventsHandler(
      this.playerManager,
      logger,
    );
    this.roomEventsHandler = new RoomEventsHandler(this.roomManager, ds);
    this.cubeGameEventsHandler = new CubeGameEventsHandler(ds);

    this.io = new Server(httpServer, {
      cors: {
        // origin: "http://localhost",
        methods: ["GET", "POST"],
      },
    });
  }

  private errorHandler(handler: EventHandler) {
    const handleError = (err: Error, callback: Callback<string>) => {
      this.logger.error(err.toString());
      if (callback && typeof callback === "function") {
        callback({ error: err.toString() });
      }
    };

    return (...args: unknown[]) => {
      const callback = args[args.length - 1];
      try {
        const ret = handler.apply(this, args);
        const promise = Promise.resolve(ret);
        if (promise.catch && typeof promise.catch === "function") {
          // async handler
          promise.catch((e: Error) => handleError(e, callback as Callback<string>));
        }
      } catch (e) {
        // sync handler
        handleError(e as Error, callback as Callback<string>);
      }
    };
  }

  private identifyPlayer = (socket: Socket, next: () => void) => {
    const player = tc(
      () => this.playerManager.findPlayer(socket.id),
      () => null,
    );
    // eslint-disable-next-line no-param-reassign
    socket.data = {
      ...socket.data,
      player,
      io: this.io,
    };
    next();
  };

  public init() {
    this.io.on("connection", (socket: Socket) => {
      socket.onAny((event, ...args) => {
        this.logger.info(`Received event: '${event}' with data:`, args);
      });

      const withPlayer = <T extends unknown[]>(handler: EventHandler) => (
        ...args: T
      ) => this.identifyPlayer(socket, () => handler(...[socket, ...args]));

      this.logger.info("Client connected");
      const { playerName, socketId } = socket.handshake.query;

      if (socketId) {
        try {
          this.playerManager.findPlayer(socketId as string);
        } catch (err: unknown) {
          socket.disconnect(true);
        }
      }

      if (playerName) {
        this.playerManager.createPlayer(playerName as string, socket.id);
      }

      if (playerName || socketId) {
        const eventListeners = [
          {
            event: "disconnect",
            handler: this.playerEventsHandler.disconnect.bind(
              this.playerEventsHandler,
            ),
          },
          {
            event: "me:profile",
            handler: this.playerEventsHandler.getMyProfile.bind(
              this.playerEventsHandler,
            ),
          },
          {
            event: "me:reconnect",
            handler: this.playerEventsHandler.reconnect.bind(
              this.playerEventsHandler,
            ),
          },
          {
            event: "me:abort_reconnect",
            handler: this.playerEventsHandler.abortReconnect.bind(
              this.playerEventsHandler,
            ),
          },
          {
            event: "me:disconnect",
            handler: this.playerEventsHandler.deepDisconnect.bind(
              this.playerEventsHandler,
            ),
          },
          {
            event: "room:list",
            handler: this.roomEventsHandler.listRoom.bind(
              this.roomEventsHandler,
            ),
          },
          {
            event: "room:get",
            handler: this.roomEventsHandler.getRoom.bind(
              this.roomEventsHandler,
            ),
          },
          {
            event: "room:create",
            handler: this.roomEventsHandler.createRoom.bind(
              this.roomEventsHandler,
            ),
          },
          {
            event: "room:join",
            handler: this.roomEventsHandler.joinRoom.bind(
              this.roomEventsHandler,
            ),
          },
          {
            event: "room:leave",
            handler: this.roomEventsHandler.leaveRoom.bind(
              this.roomEventsHandler,
            ),
          },
          {
            event: "room:startgame",
            handler: RoomEventsHandler.startGame.bind(this.roomEventsHandler),
          },
          {
            event: "cube:startdraft",
            handler: this.cubeGameEventsHandler.startDraft.bind(
              this.cubeGameEventsHandler,
            ),
          },
          {
            event: "cube:pickcard",
            handler: this.cubeGameEventsHandler.pickACard.bind(
              this.cubeGameEventsHandler,
            ),
          },
          {
            event: "cube:currentinfo",
            handler: this.cubeGameEventsHandler.currentInfo.bind(
              this.cubeGameEventsHandler,
            ),
          },
        ];

        eventListeners.forEach(({ event, handler }) => socket.on(
          event,
          this.errorHandler(withPlayer(handler as EventHandler)),
        ));
      }
    });
  }
}
