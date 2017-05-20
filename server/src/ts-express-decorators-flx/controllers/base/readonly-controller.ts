// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindByIdResult, FindResult, IEntity, QueryResult } from '@fluxgate/common';
import { Assert, IQuery, IToString } from '@fluxgate/core';

import { IReadonlyService } from '../../services/readonly-service.interface';
import { IBodyRequest } from '../../session/body-request.interface';
import { ISessionRequest } from '../../session/session-request.interface';
import { ControllerCore } from './controller-core';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (find, findById, query)
 * oder auf DB-Views arbeiten.
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ReadonlyController
 * @template T      - Entity-Typ
 * @template TId    - Typ der Id-Spalte
 */
export abstract class ReadonlyController<T, TId extends IToString> extends ControllerCore {
  protected static logger = getLogger(ReadonlyController);

  constructor(private _service: IReadonlyService<T, TId>, tableName: string, idName: string) {
    super(tableName, idName);
    Assert.notNull(_service);

    this._service.idColumnName = idName;
  }


  /**
   * Liefert eine Entity vom Typ {T} für die angegebene id.
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ControllerBase
   */
  protected findByIdInternal<T extends IEntity<TId>>(
    request: ISessionRequest,
    id: TId
  ): Promise<FindByIdResult<T, TId>> {
    return new Promise<FindByIdResult<T, TId>>((resolve, reject) => {
      this._service.findById(request, id).then((result) => {
        resolve(this.serialize(result));
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
    request: ISessionRequest,
  ): Promise<FindResult<T>> {
    return new Promise<FindResult<T>>((resolve, reject) => {
      this._service.find(request).then((result) => {
        resolve(this.serialize(result));
      });
    });
  }


  /**
   * Liefert alle Entities vom Typ {T} über die Query @param{query}.
   *
   * @protected
   * @param {IQuery} query
   * @returns {Promise<T[]>}
   *
   * @memberof ControllerBase
   */
  protected queryInternal(
    request: IBodyRequest<IQuery>
  ): Promise<QueryResult<T>> {
    return new Promise<QueryResult<T>>((resolve, reject) => {
      const deserializedQuery = this.deserialize<IQuery>(request.body);

      this._service.query(request, deserializedQuery).then((result) => {
        resolve(this.serialize(result));
      });
    });
  }


  protected getService(): IReadonlyService<T, TId> {
    return this._service;
  }
}