// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindByIdResult, IEntity } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { IReadonlyService } from '../../services/readonly-service.interface';
import { ISessionRequest } from '../../session/session-request.interface';
import { CoreController } from './core-controller';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (findById) und
 * auf Entities mit Id arbeiten
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ReadonlyController
 * @template T      - Entity-Typ
 * @template TId    - Typ der Id-Spalte
 */
export abstract class ReadonlyController<T extends IEntity<TId>, TId extends IToString> extends CoreController<T, TId> {
  protected static logger = getLogger(ReadonlyController);

  constructor(service: IReadonlyService<T, TId>, tableName: string, idName: string) {
    super(service, tableName, idName);

    this.getService().idColumnName = idName;
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
      this.getService().findById(request, id).then((result) => {
        resolve(this.serialize(result));
      });
    });
  }

  protected getService(): IReadonlyService<T, TId> {
    return super.getService() as IReadonlyService<T, TId>;
  }
}