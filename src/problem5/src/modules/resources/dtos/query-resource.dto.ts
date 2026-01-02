import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";

export class QueryResourceDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string = "";

  @IsOptional()
  @IsString()
  @IsIn(["name", "description"])
  searchBy: string = "name";

  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  order: "ASC" | "DESC" | "asc" | "desc" = "ASC";

  @IsOptional()
  @IsString()
  @IsIn(["created_at", "updated_at", "name", "description"])
  orderBy: string = "created_at";

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDeleted: boolean = false;
}
