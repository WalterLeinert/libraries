import { Entity } from './entity';
import { IFlxEntity } from './flx-entity.interface';

export abstract class FlxEntity<TId> extends Entity<TId> implements IFlxEntity<TId> {

  public abstract __version: number;

  public toString(): string {
    return `{ type: ${(this as any as Function).name}, id: ${this.id}, version: ${this.__version} }`;
  }
}