import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class AbstractRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  constructor(private repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createEntity(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async findAllEntity(): Promise<T[]> {
    return await this.repository.find({
      loadEagerRelations: true,
    });
  }

  async findEntityById(findOptions?: FindManyOptions<T> | null): Promise<T> {
    return await this.repository.findOne({
      ...findOptions,
    });
  }

  async updateEntity(id: string | number, entity: T): Promise<T> {
    await this.repository.update(id, entity);
    return this.findEntityById({
      where: { id },
    } as FindManyOptions);
  }

  async removeEntity(id: string | number): Promise<boolean> {
    const result = await this.repository.delete({
      id,
    } as unknown as FindOptionsWhere<T>);

    return result.affected !== 0;
  }
}
