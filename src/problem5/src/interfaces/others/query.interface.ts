export interface IQuery {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string;
  order?: "ASC" | "DESC" | "asc" | "desc";
  orderBy?: string;
  includeDeleted?: boolean;
}
