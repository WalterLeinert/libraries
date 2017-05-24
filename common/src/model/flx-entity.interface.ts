import { IClientEntity } from './client-entity.interface';
import { IEntity } from './entity.interface';
import { IVersionedEntity } from './versioned-entity.interface';

/**
 * Interface für unsere Entities (Id + Version + Client)
 *
 * @export
 * @interface IFlxEntity
 * @extends {IEntity<TId>}
 * @extends {IVersionedEntity}
 * @extends {IClientEntity}
 * @template TId
 */
export interface IFlxEntity<TId> extends IEntity<TId>, IVersionedEntity, IClientEntity {

}