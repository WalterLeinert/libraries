import { Table } from '../model/decorator/table';
import { IEntity } from './entity.interface';

@Table({ isAbstract: true })
export abstract class Entity<TId> implements IEntity<TId> {
  public abstract id: TId;
}