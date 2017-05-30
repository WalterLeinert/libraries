// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindResult } from '@fluxgate/common';
import { Assert } from '@fluxgate/core';

import { INanoService } from '../../services/nano-service.interface';
import { ISessionRequest } from '../../session/session-request.interface';
import { ControllerCore } from './controller-core';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (find)
 *
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ReadonlyController
 * @template T      - Entity-Typ
 */
export abstract class NanoController<T> extends ControllerCore {
  protected static logger = getLogger(NanoController);

  constructor(private _service: INanoService<T>, tableName: string, idName: string) {
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




  protected getService(): INanoService<T> {
    return this._service;
  }
}