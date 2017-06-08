// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindResult, IStatusQuery, QueryResult, StatusFilter } from '@fluxgate/common';

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

  constructor(service: ICoreService<T>, tableName: string, idName: string) {
    super(service, tableName, idName);
  }


  /**
   * Liefert alle Entities vom Typ {T}.
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ControllerBase
   */
  protected findInternal(
    request: IBodyRequest<StatusFilter>
  ): Promise<FindResult<T>> {
    return Promise.resolve()
      .then(() => this.deserialize<StatusFilter>(request.body))
      .then((deserializedFilter) => this.getService().find(request, deserializedFilter))
      .then<FindResult<T>>((result) => this.serialize(result));
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
    request: IBodyRequest<IStatusQuery>
  ): Promise<QueryResult<T>> {
    return Promise.resolve()
      .then(() => this.deserialize<IStatusQuery>(request.body))
      .then((deserializedQuery) => this.getService().query(request, deserializedQuery))
      .then<QueryResult<T>>((result) => this.serialize(result));
  }


  protected getService(): ICoreService<T> {
    return super.getService() as ICoreService<T>;
  }
}