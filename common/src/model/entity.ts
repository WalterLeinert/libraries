import { Column } from '../model/decorator/model/column';
import { IEntity } from './entity.interface';

export abstract class Entity<TId> implements IEntity<TId> {
  @Column({ name: 'id', primary: true, generated: true, displayName: 'Id' })
  public id: TId;
}