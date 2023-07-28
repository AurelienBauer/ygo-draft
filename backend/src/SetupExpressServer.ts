import helmet from "helmet";
import * as http from "http";
import * as net from "net";
import { Application, json, urlencoded } from "express";
import * as express from "express";
import ISetupServer from "./ISetupServer";
import routes from "./routes/expressRoutes";
import { DataSource } from "./data/interfaces";
import logger from "./logger";

export default class SetupExpressServer implements ISetupServer {
  private server?: http.Server;

  private connectionPool: net.Socket[];

  private app: Application;

  private port: number;

  constructor(port = 3000) {
    this.port = port;
    this.app = express();
    this.connectionPool = [];
  }

  init(ds: DataSource) {
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.app.use(helmet());
    this.app.use(routes(ds));
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server listening on port: ${this.port}`);
    });

    this.server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        logger.error("Server startup error: address already in use");
      } else {
        logger.error(err);
      }
    });

    this.server.on("connection", (connection: net.Socket) => {
      this.connectionPool.push(connection);
      connection.on("close", () => {
        this.connectionPool = this.connectionPool.filter(
          (curr) => curr !== connection
        );
      });
    });
  }

  shutDown() {
    logger.info("Received kill signal, shutting down gracefully");
    if (this.server) {
      this.server.close(() => {
        logger.info("Closed out remaining connections");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);

      this.connectionPool.forEach((curr) => curr.end());
      setTimeout(
        () => this.connectionPool.forEach((curr) => curr.destroy()),
        5000
      );
    } else {
      logger.error("Could not close connections, server is not running");
      process.exit(1);
    }
  }

  public getHTTPServer(): http.Server {
    if (this.server) {
      return this.server;
    }
    throw new Error("Server is not running");
  }
}
