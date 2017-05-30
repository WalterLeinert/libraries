// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindResult, QueryResult } from '@fluxgate/common';
import { Assert, IQuery } from '@fluxgate/core';

import { ICoreService } from '../../services/core-service.interface';
import { IBodyRequest } from '../../session/body-request.interface';
import { ISessionRequest } from '../../session/session-request.interface';
import { TableController } from './table-controller';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (find, query)
 * oder auf DB-Views arbeiten und mit Entities ohne Id/primary key
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service.
 *
 * @export
 * @abstract
 * @class ReadonlyController
 * @template T      - Entity-Typ
 */
export abstract class CoreController<T> extends TableController {
  protected static logger = getLogger(CoreController);

  constructor(private _service: ICoreService<T>, tableName: string, idName: string) {
    super(tableName, idName);
    Assert.notNull(_service);
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


  protected getService(): ICoreService<T> {
    return this._service;
  }
}