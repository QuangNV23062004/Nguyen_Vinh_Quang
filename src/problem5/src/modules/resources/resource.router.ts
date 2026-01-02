import { Router } from "express";
import {
  validateDto,
  validateQuery,
} from "../../infrastructure/http/middlewares/validation.middleware";
import { QueryResourceDto } from "./dtos/query-resource.dto";
import Container from "typedi";
import { ResourceController } from "./resource.controller";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import { UpdateResourceDto } from "./dtos/update-resource.dto";

const resourceController = Container.get(ResourceController);
const resourcesRoutes = Router();

resourcesRoutes.post(
  "/",
  validateDto(CreateResourceDto),
  resourceController.create
);

resourcesRoutes.patch(
  "/:id",
  validateDto(UpdateResourceDto),
  resourceController.update
);

resourcesRoutes.get(
  "/",
  validateQuery(QueryResourceDto),
  resourceController.findPaginated
);

resourcesRoutes.get(
  "/all",
  validateQuery(QueryResourceDto),
  resourceController.findAll
);

resourcesRoutes.get("/:id", resourceController.findById);

resourcesRoutes.delete("/:id", resourceController.softDelete);
resourcesRoutes.post("/:id/restore", resourceController.restore);
resourcesRoutes.delete("/:id/hard", resourceController.hardDelete);

export default resourcesRoutes;
