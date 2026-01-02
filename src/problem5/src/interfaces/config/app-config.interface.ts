import { IDBConfig } from "./db-config.interface";
import { IServerConfig } from "./server-config.interface";

export interface IAppConfig {
  server: IServerConfig;
  database: IDBConfig;
}
