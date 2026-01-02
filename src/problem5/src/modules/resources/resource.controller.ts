import { Inject, Service } from "typedi";
import { IResourceService } from "./interfaces/resource-service.interface";
import { ResourceService } from "./resource.service";
import { NextFunction, Response, Request } from "express";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import StatusCodeEnum from "../../application/enums/status-code-enums";
import { UpdateResourceDto } from "./dtos/update-resource.dto";
import { IQuery } from "../../interfaces/others/query.interface";

@Service()
export class ResourceController {
  constructor(
    @Inject(() => ResourceService)
    private readonly resourceService: IResourceService
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body ?? {};
      const data: CreateResourceDto = {
        name,
        description: description || "",
      };

      const response = await this.resourceService.create(data);
      return res.status(StatusCodeEnum.Created_201).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body ?? {};

      const data: UpdateResourceDto = {
        name,
        description,
        status,
      };

      const response = await this.resourceService.update(id, data);
      return res.status(StatusCodeEnum.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await this.resourceService.softDelete(id);
      return res.status(StatusCodeEnum.OK_200).json({ success: response });
    } catch (error) {
      next(error);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await this.resourceService.restore(id);
      return res.status(StatusCodeEnum.OK_200).json({ success: response });
    } catch (error) {
      next(error);
    }
  };

  hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await this.resourceService.hardDelete(id);
      return res.status(StatusCodeEnum.OK_200).json({ success: response });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = (req as any).validatedQuery || {};
      const { search, searchBy, order, orderBy, includeDeleted } =
        validatedQuery ?? {};

      const safeQuery: IQuery = {
        search: (search || "") as string,
        searchBy: (searchBy || "name") as string,
        order: (order || "ASC") as "asc" | "desc" | "ASC" | "DESC",
        orderBy: (orderBy || "created_at") as string,
        includeDeleted: includeDeleted || false,
      };

      const response = await this.resourceService.findAll(safeQuery);
      return res.status(StatusCodeEnum.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  findPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = (req as any).validatedQuery || {};
      const { page, limit, search, searchBy, order, orderBy, includeDeleted } =
        validatedQuery ?? {};
      const safeQuery: IQuery = {
        page: Number(page || 1),
        limit: Number(limit || 10),
        search: (search || "") as string,
        searchBy: (searchBy || "name") as string,
        order: (order || "ASC") as "asc" | "desc" | "ASC" | "DESC",
        orderBy: (orderBy || "created_at") as string,
        includeDeleted: includeDeleted || false,
      };

      const response = await this.resourceService.findPaginated(safeQuery);
      return res.status(StatusCodeEnum.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { includeDeleted } = req.query;
      const { id } = req.params;

      const response = await this.resourceService.findByID(
        id,
        includeDeleted === "true"
      );
      return res.status(StatusCodeEnum.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
