import { Column, Entity } from "typeorm";
import {
  IResourceEntity,
  ResourceStatus,
} from "./interfaces/resource-entity.interface";
import { BaseEntity } from "../../infrastructure/database/entity/base.entity";

@Entity("resources")
export class ResourcesEntity extends BaseEntity implements IResourceEntity {
  @Column({ name: "name", type: "text", nullable: false })
  name!: string;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string | undefined;

  @Column({
    name: "status",
    type: "enum",
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus = ResourceStatus.ACTIVE;
}
