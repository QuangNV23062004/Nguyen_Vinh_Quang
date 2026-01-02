import { FindOptionsWhere, SelectQueryBuilder } from "typeorm";

export interface IRepositoryHelper {
  addSearchBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    search?: string,
    searchBy?: string
  ): void;

  addSortBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    order?: "asc" | "desc" | "ASC" | "DESC",
    orderBy?: string
  ): void;

  addIncludeDeletedBlockForQueryBuilder(
    queryName: string,
    qb: SelectQueryBuilder<any> | null | undefined,
    includeDeleted?: boolean
  ): void;

  buildWhereClauseCheckDeleted<T extends { isDeleted?: boolean }>(
    whereClause: FindOptionsWhere<T>,
    includeDeleted?: boolean
  ): void;
}
