import { IClientEntity } from './client-entity.interface';
import { IEntity } from './entity.interface';
import { IFlxEntity } from './flx-entity.interface';
import { IStatusEntity } from './status-entity.interface';


/**
 * Interface für unsere Entities (Id + Version + Client), die auch ein Status-Bitfield enthalten
 *
 * @export
 * @interface IFlxStatusEntity
 * @extends {IFlxEntity<TId>}
 * @extends {IStatusEntity}
 * @template TId
 */
export interface IFlxStatusEntity<TId> extends IFlxEntity<TId>, IStatusEntity {
}