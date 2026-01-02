import { Inject, Service } from "typedi";
import { IResourceEntity } from "./interfaces/resource-entity.interface";
import { DatabaseInstance } from "../../infrastructure/database/instance/instance";
import { ResourcesEntity } from "./resources.entity";
import {
  DataSource,
  DeleteResult,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { IQuery } from "../../interfaces/others/query.interface";
import { IPaginatedResponse } from "../../interfaces/others/pagination.interface";
import { RepositoryHelper } from "../../shared/utils/repository-helper.utils";
import CustomException from "../../application/exceptions/custom-exception";
import StatusCodeEnum from "../../application/enums/status-code-enums";
import { IResourceRepository } from "./interfaces/resource-repository.interface";
import { GlobalException } from "../../application/exceptions/exception-name";
import { ResourceException } from "./exceptions/exceptions-name";

const queryName = "resource";

@Service()
export class ResourceRepository implements IResourceRepository {
  private resourceRepository: Repository<ResourcesEntity> | null = null;

  constructor(
    @Inject(() => RepositoryHelper)
    private readonly repositoryHelper: RepositoryHelper,
    @Inject(() => DatabaseInstance)
    private readonly databaseInstance: DatabaseInstance
  ) {}

  private getRepository(
    entityManager?: EntityManager
  ): Repository<ResourcesEntity> {
    // If entityManager is provided, always get repository from it
    if (entityManager) {
      return entityManager.getRepository(ResourcesEntity);
    }

    // Otherwise use the default cached repository
    if (!this.resourceRepository) {
      this.resourceRepository =
        this.databaseInstance.getRepository(ResourcesEntity);

      if (!this.resourceRepository) {
        throw new CustomException(
          StatusCodeEnum.InternalServerError_500,
          GlobalException.DATABASE_CONNECTION_ERROR
        );
      }
    }
    return this.resourceRepository;
  }

  getDatasource(): DataSource | null {
    return this.databaseInstance?.getDataSource();
  }

  async create(
    resource: IResourceEntity,
    entityManager?: EntityManager
  ): Promise<IResourceEntity> {
    const repository = this.getRepository(entityManager);
    const result = await repository?.save(resource);
    if (!result) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        ResourceException.FAILED_TO_CREATE_RESOURCE
      );
    }
    return result;
  }

  async findAll(
    query: IQuery,
    entityManager?: EntityManager
  ): Promise<IResourceEntity[]> {
    const repository = this.getRepository(entityManager);
    const { includeDeleted, search, searchBy, order, orderBy } = query;
    const qb = repository.createQueryBuilder(queryName);

    this.repositoryHelper.addIncludeDeletedBlockForQueryBuilder(
      queryName,
      qb,
      includeDeleted
    );

    this.repositoryHelper.addSearchBlockForQueryBuilder(
      queryName,
      qb,
      search,
      searchBy
    );

    this.repositoryHelper.addSortBlockForQueryBuilder(
      queryName,
      qb,
      order,
      orderBy
    );

    const result = await qb?.getMany();

    return result ?? [];
  }

  async findById(
    id: string,
    includeDeleted?: boolean,
    entityManager?: EntityManager
  ): Promise<IResourceEntity | null> {
    const repository = this.getRepository(entityManager);
    const whereClause: FindOptionsWhere<ResourcesEntity> = {};
    this.repositoryHelper.buildWhereClauseCheckDeleted(
      whereClause,
      includeDeleted
    );

    whereClause.id = id;
    const result = await repository.findOne({
      where: whereClause,
    });
    return result ?? null;
  }

  //validation will be perform by other layer
  async findPaginated(
    query: IQuery,
    entityManager?: EntityManager
  ): Promise<IPaginatedResponse<IResourceEntity>> {
    const repository = this.getRepository(entityManager);
    const {
      page = 1,
      limit = 10,
      search,
      searchBy,
      order,
      orderBy,
      includeDeleted,
    } = query;

    // Create query builder for getting count
    const countQb = repository.createQueryBuilder(queryName);
    this.repositoryHelper.addIncludeDeletedBlockForQueryBuilder(
      queryName,
      countQb,
      includeDeleted
    );
    this.repositoryHelper.addSearchBlockForQueryBuilder(
      queryName,
      countQb,
      search,
      searchBy
    );

    // Get total count first
    const total = await countQb.getCount();

    // Create new query builder for getting data
    const dataQb = repository.createQueryBuilder(queryName);
    this.repositoryHelper.addIncludeDeletedBlockForQueryBuilder(
      queryName,
      dataQb,
      includeDeleted
    );
    this.repositoryHelper.addSearchBlockForQueryBuilder(
      queryName,
      dataQb,
      search,
      searchBy
    );
    this.repositoryHelper.addSortBlockForQueryBuilder(
      queryName,
      dataQb,
      order,
      orderBy
    );

    const data =
      (await dataQb
        ?.skip(limit * (page - 1))
        ?.take(limit)
        ?.getMany()) || [];

    return {
      data,
      total,
      page,
      limit,
      search,
      searchBy,
      order,
      orderBy,
      includeDeleted,
    };
  }

  async update(
    id: string,
    updateData: Partial<IResourceEntity>,
    entityManager?: EntityManager
  ): Promise<IResourceEntity> {
    const repository = this.getRepository(entityManager);
    const existingResource = await this.findById(id, false, entityManager);
    if (!existingResource) {
      throw new CustomException(
        StatusCodeEnum.NotFound_404,
        ResourceException.RESOURCE_NOT_FOUND
      );
    }

    const updatedResource = {
      ...existingResource,
      ...updateData,
      id,
    };

    const result = await repository.save(updatedResource);
    if (!result) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        ResourceException.FAILED_TO_UPDATE_RESOURCE
      );
    }
    return result;
  }

  async softDelete(
    id: string,
    entityManager?: EntityManager
  ): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const existingResource = await this.findById(id, false, entityManager);
    if (!existingResource) {
      throw new CustomException(
        StatusCodeEnum.NotFound_404,
        ResourceException.RESOURCE_NOT_FOUND
      );
    }

    existingResource.isDeleted = true;

    const result = await repository.save(existingResource);
    if (!result) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        ResourceException.FAILED_TO_SOFT_DELETE_RESOURCE
      );
    }
    return true;
  }

  async restore(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const existingResource = await this.findById(id, true, entityManager);
    if (!existingResource) {
      throw new CustomException(
        StatusCodeEnum.NotFound_404,
        ResourceException.RESOURCE_NOT_FOUND
      );
    }
    existingResource.isDeleted = false;

    const result = await repository.save(existingResource);
    if (!result) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        ResourceException.FAILED_TO_RESTORE_RESOURCE
      );
    }
    return true;
  }

  async hardDelete(
    id: string,
    entityManager?: EntityManager
  ): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const existingResource = await this.findById(id, true, entityManager);
    if (!existingResource) {
      throw new CustomException(
        StatusCodeEnum.NotFound_404,
        ResourceException.RESOURCE_NOT_FOUND
      );
    }

    const result = await repository.delete({ id });
    if (!result?.affected) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        ResourceException.FAILED_TO_HARD_DELETE_RESOURCE
      );
    }
    return true;
  }
}
