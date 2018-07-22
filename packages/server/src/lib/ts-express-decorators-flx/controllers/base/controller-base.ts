// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { CreateResult, DeleteResult, IEntity, UpdateResult } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { IBaseService } from '../../services/baseService.interface';
import { IBodyRequest } from '../../session/body-request.interface';
import { ISessionRequest } from '../../session/session-request.interface';
import { ReadonlyController } from './readonly-controller';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die neben lesenden auch schreibende Zugriffe durchführen
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ControllerBase
 * @template T      - Entity-Typ
 * @template TId    - Type der Id-Spalte
 */
export abstract class ControllerBase<T extends IEntity<TId>, TId extends IToString> extends ReadonlyController<T, TId> {
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
    request: IBodyRequest<T>
  ): Promise<CreateResult<T, TId>> {
    return using(new XLog(ControllerBase.logger, levels.INFO, 'createInternal'), (log) => {
      return Promise.resolve()
        .then(() => this.deserialize<T>(request.body))
        .then((deserializedSubject) => this.service.create(request, deserializedSubject))
        .then<CreateResult<T, TId>>((result) => this.serialize(result));
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
    request: IBodyRequest<T>
  ): Promise<UpdateResult<T, TId>> {
    return using(new XLog(ControllerBase.logger, levels.INFO, 'updateInternal'), (log) => {
      return Promise.resolve()
        .then(() => this.deserialize<T>(request.body))
        .then((deserializedSubject) => this.service.update(request, deserializedSubject))
        .then<UpdateResult<T, TId>>((result) => this.serialize(result));
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
    request: ISessionRequest,
    id: TId
  ): Promise<DeleteResult<TId>> {
    return using(new XLog(ControllerBase.logger, levels.INFO, 'deleteInternal'), (log) => {
      return Promise.resolve()
        .then(() => this.service.delete(request, id))
        .then<DeleteResult<TId>>((result) => this.serialize(result));
    });
  }


  protected get service(): IBaseService<T, TId> {
    return super.getService() as IBaseService<T, TId>;
  }
}