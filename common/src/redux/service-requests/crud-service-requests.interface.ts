import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { IServiceRequests } from './service-requests.interface';


/**
 * Interface für CRUD-Operationen über ServiceRequests und Rest-API.
 *
 * @export
 * @interface ICrudServiceRequests
 * @extends {IServiceRequests}
 * @template T - Entity-Typ
 * @template TId - Typ der Entity-Id
 */
export interface ICrudServiceRequests<T extends IEntity<TId>, TId extends IToString> extends IServiceRequests {

  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ICrudServiceRequests
   */
  create(item: T): Promise<ICrudServiceState<T, TId>>;

  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   *
   * @memberOf ICrudServiceRequests
   */
  find(useCache?: boolean): void;


  /**
   * Führt die findById-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ICrudServiceRequests
   */
  findById(id: TId): void;


  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ICrudServiceRequests
   */
  update(item: T): void;


  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ICrudServiceRequests
   */
  delete(id: TId): void;

  /**
   * Liefert den Status für die @param{storeId}
   *
   * @param {string} storeId
   * @returns {ICrudServiceState<T, TId>}
   *
   * @memberOf ICrudServiceRequests
   */
  getCrudState(storeId: string): ICrudServiceState<T, TId>;


  /**
   * Liefert die Id der Entity @param{item}
   *
   * @param {T} item
   * @returns {TId}
   *
   * @memberOf ICrudServiceRequests
   */
  getEntityId(item: T): TId;

  /**
   * Liefert den Namen der zugehörigen Modelklasse der Entity (z.B. User)
   *
   * @returns {string}
   *
   * @memberOf ICrudServiceRequests
   */
  getModelClassName(): string;
}