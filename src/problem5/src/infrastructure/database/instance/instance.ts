import { Service } from "typedi";
import { DataSource, Repository, EntityTarget, ObjectLiteral } from "typeorm";

@Service()
export class DatabaseInstance {
  private dataSource: DataSource | null = null;

  setDataSource(dataSource: DataSource): void {
    this.dataSource = dataSource;
  }

  getDataSource(): DataSource | null {
    return this.dataSource;
  }

  getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    entityManager?: import("typeorm").EntityManager
  ): Repository<Entity> | null {
    if (entityManager) {
      return entityManager.getRepository(entity);
    }

    return this.dataSource?.getRepository(entity) ?? null;
  }

  isInitialized(): boolean {
    return this.dataSource?.isInitialized ?? false;
  }
}
