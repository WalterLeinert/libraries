import { IEntity } from '../../model/entity.interface';
import { ICrudServiceState } from './crud-service-state.interface';
import { ICurrentItemServiceState } from './current-item-service-state.interface';

/**
 * Interface für den Service-Status von CRUD Servicerequests und currentItem
 *
 * @export
 * @interface IExtendedCrudServiceState
 * @template T
 * @template TId
 */
export interface IExtendedCrudServiceState<T extends IEntity<TId>, TId>
  extends ICrudServiceState<T, TId>, ICurrentItemServiceState<T> {
}