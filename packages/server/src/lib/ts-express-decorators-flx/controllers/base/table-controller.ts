// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert } from '@fluxgate/core';

import { IServiceCore } from '../../services/service-core.interface';
import { ControllerCore } from './controller-core';

/**
 * Abstrakte Basisklasse für alle Controller, die über Knex auf DB-Tabellen arbeiten
 *
 * @export
 * @abstract
 * @class ContrTableControllerollerCore
 */
export abstract class TableController extends ControllerCore {
  protected static logger = getLogger(TableController);

  protected constructor(service: IServiceCore, private _tableName: string, private _idName: string) {
    super(service);
    Assert.notNullOrEmpty(_tableName);
    Assert.notNullOrEmpty(_idName);
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