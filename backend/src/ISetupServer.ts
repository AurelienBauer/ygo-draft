import { Server } from 'http';
import { DataSource } from './data/interfaces';

export default interface SetupServer {
  start(): void;
  init(ds: DataSource): void;
  shutDown(): void;
  getHTTPServer(): Server;
}
