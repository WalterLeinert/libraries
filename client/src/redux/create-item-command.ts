import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';


/**
 * Kommando zum Erzeugen eines neuen Items über einen Rest-Service.
 *
 * Der eigentliche Erzeugen wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class CreateItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class CreateItemCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
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
    return { ...state, item: this.item };
  }
}