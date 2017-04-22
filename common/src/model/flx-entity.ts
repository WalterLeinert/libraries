import { Column } from '../model/decorator/model/column';
import { Version } from '../model/decorator/model/version';
import { Entity } from './entity';
import { IFlxEntity } from './flx-entity.interface';

export abstract class FlxEntity<TId> extends Entity<TId> implements IFlxEntity<TId> {

  @Version()
  @Column({ name: '__version', displayName: 'Version', default: 0 })
  public __version: number;
}