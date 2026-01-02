import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateResourceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
