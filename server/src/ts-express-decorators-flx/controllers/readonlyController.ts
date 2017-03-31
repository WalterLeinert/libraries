// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IToString, ServerSystemException, ServiceResult } from '@fluxgate/common';

import { BaseService } from '../services/base.service';
import { ControllerBase } from './controllerBase';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die z.B. auf DB-Views arbeiten
 * 
 * Erlaubt keine modifizierenden Aktionen.
 * 
 * @export
 * @abstract
 * @class ControllerBase
 * @template T      - Entity-Typ
 * @template TId    - Type der Id-Spalte
 */
export abstract class ReadonlyController<T, TId extends IToString> extends ControllerBase<T, TId> {
  protected static logger = getLogger(ControllerBase);

  constructor(service: BaseService<T, TId>, tableName: string, idName: string) {
    super(service, tableName, idName);
  }


  /**
   * Erzeugt und persistiert eine neue Instanz der Entity {T}.
   * 
   * @param {T} subject
   * @returns {Promise<T>}
   * 
   * @memberOf ControllerBase
   */
  protected createInternal(
    subject: T
  ): Promise<T> {
    return Promise.reject(new ServerSystemException(`readonly: create Operation nicht unterstützt`));
  }


  /**
   * Liefert eine Entity vom Typ {T} für die angegebene id.
   * 
   * @param {TId} id
   * @returns {Promise<T>}
   * 
   * @memberOf ControllerBase
   */
  protected findByIdInternal(
    id: TId
  ): Promise<T> {
    return super.findByIdInternal(id);
  }


  /**
   * Liefert alle Entities vom Typ {T}.
   * 
   * @returns {Promise<T[]>}
   * 
   * @memberOf ControllerBase
   */
  protected findInternal(
  ): Promise<T[]> {
    return super.findInternal();
  }


  /**
   * Aktualisiert die Entity vom Typ {T}.
   * 
   * @param {T} subject
   * @returns {Promise<T>}
   * 
   * @memberOf ControllerBase
   */
  protected updateInternal(
    subject: T
  ): Promise<T> {
    return Promise.reject(new ServerSystemException(`readonly: update Operation nicht unterstützt`));
  }


  /**
   * Löscht die Entity vom Typ {T} für die angegebene id.
   * 
   * @param {TId} id
   * @returns {Promise<TId>}
   * 
   * @memberOf ControllerBase
   */
  protected deleteInternal(
    id: TId
  ): Promise<ServiceResult<TId>> {
    return Promise.reject(new ServerSystemException(`readonly: delete Operation nicht unterstützt`));
  }

}