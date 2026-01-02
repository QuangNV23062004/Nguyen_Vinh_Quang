import { IBaseEntity } from "../../../interfaces/entity/base-entity.interface";

export enum ResourceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface IResourceEntity extends IBaseEntity {
  name: string;
  description?: string;
  status: ResourceStatus;
}
