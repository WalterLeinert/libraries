import { Observable } from 'rxjs';

import { IToString } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
import { ICoreService } from './core-service.interface';
import { FindByIdResult } from './find-by-id-result';


/**
 * Interface für alle readonly Services
 */
export interface IReadonlyService<T extends IEntity<TId>, TId extends IToString> extends ICoreService<T> {

  /**
   * Find the entity with the given id.
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<FindByIdResult<T, TId>>}
   *
   */
  findById(id: TId): Observable<FindByIdResult<T, TId>>;
}