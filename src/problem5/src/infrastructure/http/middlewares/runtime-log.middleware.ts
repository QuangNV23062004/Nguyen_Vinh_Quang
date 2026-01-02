import { NextFunction, Response, Request } from "express";
import getLogger from "../../../shared/utils/logger.utils";

export const RunTimeLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = getLogger("API");
  const startTime = new Date();

  res.on("finish", () => {
    const duration = new Date().getTime() - startTime.getTime();
    const logMessage = `${req.ip} ${req.method} ${
      req.originalUrl
    } ${req.protocol.toUpperCase()}/${req.httpVersion} ${res.statusCode} ${
      res.get("Content-Length") || 0
    } ${req.get("User-Agent")} ${duration}ms`;
    logger.info(logMessage);
  });

  next();
};
