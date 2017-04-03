import { IException } from '@fluxgate/common';

import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';


/**
 * Kommando zum Ablegen einer Exception nach einem Fehler bei einem Rest-Servicecall.
 *
 * @export
 * @class ErrorCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ErrorCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private error: IException) {
    super(storeId);
  }


  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   */
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return { ...state, error: this.error };
  }
}