import { Observable } from 'rxjs/Observable';
import { IQuery } from '../query/query.interface';
import { ServiceResult } from './serviceResult';

/**
 * Interface mit CRUD-Funktionen
 *
 * Hier sind keine generischen Typen verwendet, damit man das Interface auch
 * generisch in Zusammenhang mit Reflection un Metadaten verwenden kann.
 */
export interface IServiceCrud<T, TId> {

  /**
   * Create the entity {item} and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   */
  create(item: T): Observable<T>;

  /**
   * Queries all entities of type T with given @param{query} and return {Observable<T[]>}.
   *
   * @param {IQuery} query
   * @returns {Observable<T[]>}
   *
   */
  query(query: IQuery): Observable<T[]>;

  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   */
  find(): Observable<T[]>;

  /**
   * Find the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<T>}
   *
   */
  findById(id: TId): Observable<T>;

  /**
   * Update the entity {item} with the given id and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   */
  update(item: T): Observable<T>;


  /**
   * Delete the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id
   * @returns {Observable<ServiceResult<TId>>}
   *
   */
  delete(id: TId): Observable<ServiceResult<TId>>;

}