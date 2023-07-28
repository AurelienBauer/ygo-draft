import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { DataSource } from "../data/interfaces";
import RoomManager from "../domain/useCases/GameRoomManager";
import PlayerManager from "../domain/useCases/PlayerManager";
import PlayerEventsHandler from "./PlayerEventsHandler";
import RoomEventsHandler from "./RoomEventsHandler";
import { Logger } from "winston";
import CubeGameEventsHandler from "./CubeGameEventsHandler";
import { Callback } from "./event";

/// try/catch
const tc = (tryFunc: Function, catchFunc: Function) => {
  let val: any;
  try {
    val = tryFunc();
  } catch (e) {
    val = catchFunc(e);
  }
  return val;
};

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
      logger
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

  private errorHandler(handler: Function) {
    const handleError = (err: Error, callback: Callback<string>) => {
      this.logger.error(err.toString());
      if (callback && typeof callback === "function") {
        callback({ error: err.toString() });
      }
    };

    return (...args: any[]) => {
      const callback = args[args.length - 1] as unknown;
      try {
        const ret = handler.apply(this, args);
        if (ret && typeof ret.catch === "function") {
          // async handler
          ret.catch((e: Error) => handleError(e, callback as Callback<string>));
        }
      } catch (e: any) {
        // sync handler
        handleError(e, callback as Callback<string>);
      }
    };
  }

  public init() {
    this.io.on("connection", (socket: Socket) => {
      socket.onAny((event, ...args) => {
        this.logger.info(`Received event: '${event}' with data:`, args);
      });

      const identifyPlayer = (socket: Socket, next: () => void) => {
        const player = tc(
          () => this.playerManager.findPlayer(socket.id),
          () => null
        );
        socket.data = { player, io: this.io };
        next();
      };

      const withPlayer =
        <T extends unknown[]>(handler: Function) =>
        (...args: T) => {
          return identifyPlayer(socket, () => handler(...[socket, ...args]));
        };

      this.logger.info("Client connected");
      const { playerName, socketId } = socket.handshake.query;

      if (socketId) {
        try {
          this.playerManager.findPlayer(socketId as string);
        } catch (err: any) {
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
              this.playerEventsHandler
            ),
          },
          {
            event: "me:profile",
            handler: this.playerEventsHandler.getMyProfile.bind(
              this.playerEventsHandler
            ),
          },
          {
            event: "me:reconnect",
            handler: this.playerEventsHandler.reconnect.bind(
              this.playerEventsHandler
            ),
          },
          {
            event: "me:abort_reconnect",
            handler: this.playerEventsHandler.abortReconnect.bind(
              this.playerEventsHandler
            ),
          },
          {
            event: "me:disconnect",
            handler: this.playerEventsHandler.deepDisconnect.bind(
              this.playerEventsHandler
            ),
          },
          {
            event: "room:list",
            handler: this.roomEventsHandler.listRoom.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "room:get",
            handler: this.roomEventsHandler.getRoom.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "room:create",
            handler: this.roomEventsHandler.createRoom.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "room:join",
            handler: this.roomEventsHandler.joinRoom.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "room:leave",
            handler: this.roomEventsHandler.leaveRoom.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "room:startgame",
            handler: this.roomEventsHandler.startGame.bind(
              this.roomEventsHandler
            ),
          },
          {
            event: "cube:startdraft",
            handler: this.cubeGameEventsHandler.startDraft.bind(
              this.cubeGameEventsHandler
            ),
          },
          {
            event: "cube:pickcard",
            handler: this.cubeGameEventsHandler.pickACard.bind(
              this.cubeGameEventsHandler
            ),
          },
          {
            event: "cube:currentinfo",
            handler: this.cubeGameEventsHandler.currentInfo.bind(
              this.cubeGameEventsHandler
            ),
          },
        ];

        for (const { event, handler } of eventListeners) {
          socket.on(event, this.errorHandler(withPlayer(handler)));
        }
      }
    });
  }
}
