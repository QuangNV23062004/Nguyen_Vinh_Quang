import { Service } from "typedi";
import { FindOptionsWhere, SelectQueryBuilder } from "typeorm";
import { IRepositoryHelper } from "../../interfaces/repository/repository-helper.interface";

@Service()
export class RepositoryHelper implements IRepositoryHelper {
  //for query builder
  addSearchBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    search?: string,
    searchBy?: string
  ): void {
    if (search && searchBy) {
      qb?.andWhere(`${queryName}.${searchBy} LIKE :search`, {
        search: `%${search}%`,
      });
    }
  }

  //for query builder
  addSortBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    order?: "asc" | "desc" | "ASC" | "DESC",
    orderBy?: string
  ): void {
    if (orderBy && order) {
      qb?.orderBy(
        `${queryName}.${orderBy}`,
        order.toUpperCase() as "ASC" | "DESC"
      );
    }
  }

  addIncludeDeletedBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    includeDeleted?: boolean
  ): void {
    if (!includeDeleted) {
      qb?.andWhere(`${queryName}.isDeleted = false`);
    }
  }

  //for where clause
  buildWhereClauseCheckDeleted<T extends { isDeleted?: boolean }>(
    whereClause: FindOptionsWhere<T>,
    includeDeleted?: boolean
  ): void {
    if (!includeDeleted) {
      (whereClause as any).isDeleted = false;
    }
  }
}
