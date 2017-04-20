import { IEntity } from './entity.interface';
import { IVersionedEntity } from './versioned-entity.interface';

/**
 * Interface für unsere Entities (Id + Version)
 *
 * @export
 * @interface IFlxEntity
 * @extends {IEntity<TId>}
 * @extends {IVersionedEntity}
 * @template TId
 */
export interface IFlxEntity<TId> extends IEntity<TId>, IVersionedEntity {

}