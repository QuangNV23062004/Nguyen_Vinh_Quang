export type DBType = "mysql" | "postgres" | "sqlite" | "mssql" | "mongodb";
export interface IDBConfig {
  type: DBType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}
