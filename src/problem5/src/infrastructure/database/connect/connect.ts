import { DataSource } from "typeorm";
import { Container } from "typedi";
import { IDBConfig } from "../../../interfaces/config/db-config.interface";
import { DatabaseInstance } from "../instance/instance";
import getLogger from "../../../shared/utils/logger.utils";

export const ConnectDB = async (dbconfig: IDBConfig, entityPath: string) => {
  const logger = getLogger("DATABASE");
  const AppDataSource = new DataSource({
    ...dbconfig,
    entities: [entityPath],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
  });

  try {
    await AppDataSource.initialize();
    const databaseInstance = Container.get(DatabaseInstance);
    databaseInstance.setDataSource(AppDataSource);
    logger.info("Data Source has been initialized!");
  } catch (error) {
    logger.error("Error during Data Source initialization", error);
    throw error;
  }
};
