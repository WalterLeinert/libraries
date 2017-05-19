import { Observable } from 'rxjs/Observable';


import { IEntity } from '../entity.interface';
import { CreateResult } from './create-result';
import { DeleteResult } from './delete-result';
import { IReadonlyService } from './readonly-service.interface';
import { UpdateResult } from './update-result';


/**
 * Interface mit CRUD-Funktionen (schreibende und lesende Operationen)
 *
 */
export interface IServiceCrud<T extends IEntity<TId>, TId> extends IReadonlyService<T, TId> {

  /**
   * Create the entity {item}.
   *
   * @param {T} item
   * @returns {Observable<CreateResult<T>>}
   *
   */
  create(item: T): Observable<CreateResult<T, TId>>;


  /**
   * Update the entity {item} with the given id.
   *
   * @param {T} item
   * @returns {Observable<UpdateResult<T>>}
   *
   */
  update(item: T): Observable<UpdateResult<T, TId>>;


  /**
   * Delete the entity with the given id.
   *
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   */
  delete(id: TId): Observable<DeleteResult<TId>>;

}