import { DataSource, DeleteResult, EntityManager } from "typeorm";
import { IResourceEntity } from "./resource-entity.interface";
import { IQuery } from "../../../interfaces/others/query.interface";
import { IPaginatedResponse } from "../../../interfaces/others/pagination.interface";

export interface IResourceRepository {
  getDatasource(): DataSource | null;
  create(
    resource: IResourceEntity,
    entityManager?: EntityManager
  ): Promise<IResourceEntity>;
  findAll(
    query: IQuery,
    entityManager?: EntityManager
  ): Promise<IResourceEntity[]>;
  findById(
    id: string,
    includeDeleted?: boolean,
    entityManager?: EntityManager
  ): Promise<IResourceEntity | null>;
  findPaginated(
    query: IQuery,
    entityManager?: EntityManager
  ): Promise<IPaginatedResponse<IResourceEntity>>;
  update(
    id: string,
    updateData: Partial<IResourceEntity>,
    entityManager?: EntityManager
  ): Promise<IResourceEntity>;
  softDelete(id: string, entityManager?: EntityManager): Promise<boolean>;
  restore(id: string, entityManager?: EntityManager): Promise<boolean>;
  hardDelete(id: string, entityManager?: EntityManager): Promise<boolean>;
}
