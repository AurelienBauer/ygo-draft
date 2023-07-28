import SetupExpressServer from "./SetupExpressServer";
import ISetupServer from "./ISetupServer";
import connectDb from "./data/mongoDBDataSource/service";
import { DataSource } from "./data/interfaces";
import YGODataSource from "./data/YGODataSource";
import config from "./config";
import logger from "./logger";
import SocketHandler from "./socketEvents/SocketHandler";

(() => {
  const server: ISetupServer = new SetupExpressServer(config.get("PORT"));

  try {
    const ds: DataSource = new YGODataSource();

    server.init(ds);
    server.start();

    const socketHandler = new SocketHandler(server.getHTTPServer(), ds, logger);
    socketHandler.init();

    process.on("SIGTERM", server.shutDown);
    process.on("SIGINT", server.shutDown);

    connectDb(() => server.shutDown());
  } catch (err: unknown) {
    server.shutDown();
  }
})();
