import { Table } from '../model/decorator/table';
import { VersionColumn } from '../model/decorator/version-column';
import { Entity } from './entity';
import { IVersionedEntity } from './versioned-entity.interface';


/**
 * Abstrakte Basisklasse für alle versionierten Entities
 *
 * @export
 * @abstract
 * @class VersionedEntity
 * @extends {Entity<TId>}
 * @implements {IVersionedEntity}
 * @template TId
 */
@Table()
export abstract class VersionedEntity<TId> extends Entity<TId> implements IVersionedEntity {

  @VersionColumn({ name: '__version', displayName: 'Version', default: 0 })
  public __version: number;

  public toString(): string {
    return `{ type: ${(this as any as Function).name}, id: ${this.id}, version: ${this.__version} }`;
  }
}