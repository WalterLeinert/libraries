import { IEntity } from './entity.interface';

export abstract class Entity<TId> implements IEntity<TId> {
  public abstract id: TId;
}