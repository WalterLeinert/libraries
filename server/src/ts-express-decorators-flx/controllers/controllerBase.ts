// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IToString, ServiceResult } from '@fluxgate/common';

import { BaseService } from '../services/base.service';


/**
 * Abstrakte Basisklasse für alle REST-Controller.
 * 
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 * 
 * @export
 * @abstract
 * @class ControllerBase
 * @template T      - Entity-Typ
 * @template TId    - Type der Id-Spalte
 */
export abstract class ControllerBase<T, TId extends IToString> {
  protected static logger = getLogger(ControllerBase);

  constructor(private service: BaseService<T, TId>, private _tableName: string, private _idName: string) {
    this.service.setIdColumn(this._idName);
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
    return this.service.create(subject);
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
    return this.service.findById(id);
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
    return this.service.find();
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
    return this.service.update(subject);
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
    return this.service.delete(id);
  }


  /**
   * Liefert den zugehörigen Tabellennamen
   * 
   * @readonly
   * @protected
   * @type {string}
   * @memberOf ControllerBase
   */
  protected get tableName(): string {
    return this._tableName;
  }

  /**
   * Liefert den zugehörigen PrimaryKey-Tabellenspaltennamen.
   * 
   * @readonly
   * @protected
   * @type {string}
   * @memberOf ControllerBase
   */
  protected get idName(): string {
    return this._idName;
  }

}