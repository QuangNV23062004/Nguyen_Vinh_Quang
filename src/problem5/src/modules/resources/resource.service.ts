import { Inject, Service } from "typedi";
import { IResourceService } from "./interfaces/resource-service.interface";
import { IResourceEntity } from "./interfaces/resource-entity.interface";
import { IPaginatedResponse } from "../../interfaces/others/pagination.interface";
import { IQuery } from "../../interfaces/others/query.interface";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import { UpdateResourceDto } from "./dtos/update-resource.dto";
import { IResourceRepository } from "./interfaces/resource-repository.interface";
import { ResourceRepository } from "./resource.repository";
import CustomException from "../../application/exceptions/custom-exception";
import StatusCodeEnum from "../../application/enums/status-code-enums";
import { GlobalException } from "../../application/exceptions/exception-name";
import { ResourceException } from "./exceptions/exceptions-name";

@Service()
export class ResourceService implements IResourceService {
  constructor(
    @Inject(() => ResourceRepository)
    private readonly resourceRepository: IResourceRepository
  ) {}

  create = async (
    createResourceDto: CreateResourceDto
  ): Promise<IResourceEntity> => {
    const resource: IResourceEntity = {
      ...createResourceDto,
    } as IResourceEntity;

    const datasource = this.resourceRepository.getDatasource();
    if (!datasource) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Database connection not established"
      );
    }

    return datasource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.resourceRepository.create(
          resource,
          transactionalEntityManager
        );
      }
    );
  };

  update = async (
    id: string,
    updateResourceDto: UpdateResourceDto
  ): Promise<IResourceEntity> => {
    // Check if resource exists
    const datasource = this.resourceRepository.getDatasource();
    if (!datasource) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        GlobalException.DATABASE_CONNECTION_ERROR
      );
    }

    return datasource.manager.transaction(
      async (transactionalEntityManager) => {
        const existingResource = await this.resourceRepository.findById(
          id,
          false,
          transactionalEntityManager
        );
        if (!existingResource) {
          throw new CustomException(
            StatusCodeEnum.NotFound_404,
            ResourceException.RESOURCE_NOT_FOUND
          );
        }

        const updateData: Partial<IResourceEntity> = {};
        if (updateResourceDto.name !== undefined) {
          updateData.name = updateResourceDto.name;
        }
        if (updateResourceDto.description !== undefined) {
          updateData.description = updateResourceDto.description;
        }
        if (updateResourceDto.status !== undefined) {
          updateData.status = updateResourceDto.status;
        }

        return await this.resourceRepository.update(
          id,
          updateData,
          transactionalEntityManager
        );
      }
    );
  };

  softDelete = async (id: string): Promise<boolean> => {
    const datasource = this.resourceRepository.getDatasource();
    if (!datasource) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        GlobalException.DATABASE_CONNECTION_ERROR
      );
    }

    return datasource.manager.transaction(
      async (transactionalEntityManager) => {
        // Check if resource exists
        const existingResource = await this.resourceRepository.findById(
          id,
          false,
          transactionalEntityManager
        );
        if (!existingResource) {
          throw new CustomException(
            StatusCodeEnum.NotFound_404,
            ResourceException.RESOURCE_NOT_FOUND
          );
        }

        return await this.resourceRepository.softDelete(
          id,
          transactionalEntityManager
        );
      }
    );
  };

  restore = async (id: string): Promise<boolean> => {
    const datasource = this.resourceRepository.getDatasource();
    if (!datasource) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        GlobalException.DATABASE_CONNECTION_ERROR
      );
    }

    return datasource.manager.transaction(
      async (transactionalEntityManager) => {
        // Check if resource exists (including deleted)
        const existingResource = await this.resourceRepository.findById(
          id,
          true,
          transactionalEntityManager
        );
        if (!existingResource) {
          throw new CustomException(
            StatusCodeEnum.NotFound_404,
            ResourceException.RESOURCE_NOT_FOUND
          );
        }

        return await this.resourceRepository.restore(
          id,
          transactionalEntityManager
        );
      }
    );
  };

  hardDelete = async (id: string): Promise<boolean> => {
    // Check if resource exists
    const datasource = this.resourceRepository.getDatasource();
    if (!datasource) {
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        GlobalException.DATABASE_CONNECTION_ERROR
      );
    }

    return datasource.manager.transaction(
      async (transactionalEntityManager) => {
        const existingResource = await this.resourceRepository.findById(
          id,
          true,
          transactionalEntityManager
        );
        if (!existingResource) {
          throw new CustomException(
            StatusCodeEnum.NotFound_404,
            ResourceException.RESOURCE_NOT_FOUND
          );
        }

        return await this.resourceRepository.hardDelete(
          id,
          transactionalEntityManager
        );
      }
    );
  };

  findAll = async (query: IQuery): Promise<IResourceEntity[]> => {
    return await this.resourceRepository.findAll(query);
  };

  findPaginated = async (
    query: IQuery
  ): Promise<IPaginatedResponse<IResourceEntity>> => {
    return await this.resourceRepository.findPaginated(query);
  };

  findByID = async (
    id: string,
    includeDeleted: boolean = false
  ): Promise<IResourceEntity> => {
    const resource = await this.resourceRepository.findById(id, includeDeleted);
    if (!resource) {
      throw new CustomException(
        StatusCodeEnum.NotFound_404,
        ResourceException.RESOURCE_NOT_FOUND
      );
    }
    return resource;
  };
}
