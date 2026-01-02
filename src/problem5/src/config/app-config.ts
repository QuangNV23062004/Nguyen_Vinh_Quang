import { IAppConfig } from "../interfaces/config/app-config.interface";
import { DBType } from "../interfaces/config/db-config.interface";
import { GetEnv, GetEnvAsBoolean, GetEnvAsNumber } from "./env";
import dotenv from "dotenv";

dotenv.config();
export const AppConfig: IAppConfig = {
  server: {
    port: GetEnvAsNumber("PORT", 8080),
    mobileUrl: GetEnv("MOBILE_URL", "http://localhost:8081"),
    websiteUrl: GetEnv("WEBSITE_URL", "http://localhost:3000"),
  },
  database: {
    type: GetEnv("DB_TYPE", "postgres") as DBType,
    host: GetEnv("DB_HOST", "localhost"),
    port: GetEnvAsNumber("DB_PORT", 5434),
    username: GetEnv("DB_USERNAME", "postgres"),
    password: GetEnv("DB_PASSWORD", "postgres"),
    database: GetEnv("DB_DATABASE", "postgres"),
    synchronize: GetEnvAsBoolean("DB_SYNCHRONIZE", true),
  },
};
