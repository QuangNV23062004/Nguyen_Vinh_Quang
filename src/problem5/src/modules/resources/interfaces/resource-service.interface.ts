import { CreateResourceDto } from "../dtos/create-resource.dto";
import { UpdateResourceDto } from "../dtos/update-resource.dto";
import { IPaginatedResponse } from "../../../interfaces/others/pagination.interface";
import { IQuery } from "../../../interfaces/others/query.interface";
import { IResourceEntity } from "./resource-entity.interface";

export interface IResourceService {
  create: (createResourceDto: CreateResourceDto) => Promise<IResourceEntity>;
  update: (
    id: string,
    updateResourceDto: UpdateResourceDto
  ) => Promise<IResourceEntity>;
  softDelete: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  hardDelete: (id: string) => Promise<boolean>;
  findAll: (query: IQuery) => Promise<IResourceEntity[]>;
  findPaginated: (
    query: IQuery
  ) => Promise<IPaginatedResponse<IResourceEntity>>;
  findByID: (id: string, includeDeleted: boolean) => Promise<IResourceEntity>;
}
