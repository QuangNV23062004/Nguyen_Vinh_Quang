export interface IPaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string;
  order?: "ASC" | "DESC" | "asc" | "desc";
  orderBy?: string;
  includeDeleted?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
