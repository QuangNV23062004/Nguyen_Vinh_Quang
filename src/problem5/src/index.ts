import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import getLogger from "./shared/utils/logger.utils";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";

import ErrorLogMiddleware from "./infrastructure/http/middlewares/error-log.middleware";
import StatusCodeEnum from "./application/enums/status-code-enums";
import { ConnectDB } from "./infrastructure/database/connect/connect";
import { AppConfig } from "./config/app-config";

//routes
import resourcesRoutes from "./modules/resources/resource.router";
import { RunTimeLogMiddleware } from "./infrastructure/http/middlewares/runtime-log.middleware";

async function bootstrap() {
  const app: Application = express();
  const PORT = AppConfig.server.port;

  const entityPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "modules", "**", "*.entity.js")
      : path.join(__dirname, "modules", "**", "*.entity.ts");

  await ConnectDB(AppConfig.database, entityPath);

  app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
  app.use(cookieParser());

  app.use(helmet());
  app.use(
    cors({
      origin: [
        AppConfig.server.mobileUrl as string,
        AppConfig.server.websiteUrl as string,
        "http://localhost:3000",
        "http://localhost:8081",
      ],
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.use(express.json());

  app.use(RunTimeLogMiddleware);

  app.use("/resources", resourcesRoutes);

  app.use(ErrorLogMiddleware);

  app.get("/", (req: Request, res: Response) => {
    res.status(StatusCodeEnum.OK_200).send("Keep api alive");
  });

  const server = http.createServer(app);

  server.listen(PORT, async (err?: Error) => {
    const logger = getLogger("APP");
    if (err) {
      logger.error("Failed to start server:", err);
      process.exit(1);
    } else {
      logger.info(`Server is running at port ${PORT}`);
    }
  });
}

bootstrap();
