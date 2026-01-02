import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from "class-validator";
import { ResourceStatus } from "../interfaces/resource-entity.interface";
import { CreateResourceDto } from "./create-resource.dto";

export class UpdateResourceDto implements Partial<CreateResourceDto> {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;
}
