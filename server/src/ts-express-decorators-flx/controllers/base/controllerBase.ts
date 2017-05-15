// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { CreateResult, DeleteResult, UpdateResult } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { IBaseService } from '../../services/baseService.interface';
import { FindController } from './find-controller';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die neben nur lesenden auch schreibende Zugriffe durchführen
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ControllerBase
 * @template T      - Entity-Typ
 * @template TId    - Type der Id-Spalte
 */
export abstract class ControllerBase<T, TId extends IToString> extends FindController<T, TId> {
  protected static logger = getLogger(ControllerBase);


  constructor(service: IBaseService<T, TId>, tableName: string, idName: string) {
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
  ): Promise<CreateResult<T>> {
    return new Promise<CreateResult<T>>((resolve, reject) => {
      const deserializedSubject = this.deserialize<T>(subject);
      this.service.create(deserializedSubject).then((item) => {
        resolve(this.serialize(item));
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
  ): Promise<UpdateResult<T>> {
    return new Promise<UpdateResult<T>>((resolve, reject) => {
      const deserializedSubject = this.deserialize<T>(subject);
      this.service.update(deserializedSubject).then((item) => {
        resolve(this.serialize(item));
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
  ): Promise<DeleteResult<TId>> {
    return new Promise<DeleteResult<TId>>((resolve, reject) => {
      this.service.delete(id).then((result) => {
        resolve(this.serialize(result));
      });
    });
  }

  protected get service(): IBaseService<T, TId> {
    return this.service as IBaseService<T, TId>;
  }
}