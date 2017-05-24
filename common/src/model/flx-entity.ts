import { ClientColumn } from '../model/decorator/client-column';
import { Table } from '../model/decorator/table';
import { IClientEntity } from './client-entity.interface';
import { VersionedEntity } from './versioned-entity';

/**
 * Abstrakte Basisklasse für alle versionierten Entities, die mandantenfähig sind.
 *
 * @export
 * @abstract
 * @class FlxEntity
 * @extends {VersionedEntity<TId>}
 * @implements {IClientEntity}
 * @template TId
 */
@Table()
export abstract class FlxEntity<TId> extends VersionedEntity<TId> implements IClientEntity {

  @ClientColumn({ name: '__client' })
  public __client: number;   // = Mandant.FIRST_ID;

  public toString(): string {
    return `{ type: ${(this as any as Function).name}, id: ${this.id}, version: ${this.__version} }`;
  }
}