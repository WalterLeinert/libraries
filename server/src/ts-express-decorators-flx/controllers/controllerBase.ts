// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { ServiceResult } from '@fluxgate/common';
import { IToString, JsonSerializer } from '@fluxgate/core';

import { BaseService } from '../services/baseService';


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

  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: BaseService<T, TId>, private _tableName: string, private _idName: string) {
    this.service.idColumnName = this._idName;
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
    const deserializedSubject = this.serializer.deserialize<T>(subject);

    return new Promise<T>((resolve, reject) => {
      this.service.create(deserializedSubject).then((item) => {
        resolve(this.serializer.serialize<T>(item));
      });
    });
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

    return new Promise<T>((resolve, reject) => {
      this.service.findById(id).then((item) => {
        resolve(this.serializer.serialize<T>(item));
      });
    });
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

    return new Promise<T[]>((resolve, reject) => {
      this.service.find().then((items) => {
        resolve(this.serializer.serialize<T[]>(items));
      });
    });
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
    return new Promise<T>((resolve, reject) => {
      this.service.update(subject).then((item) => {
        resolve(this.serializer.serialize<T>(item));
      });
    });
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
    return new Promise<ServiceResult<TId>>((resolve, reject) => {
      this.service.delete(id).then((result) => {
        resolve(this.serializer.serialize<ServiceResult<TId>>(result));
      });
    });
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