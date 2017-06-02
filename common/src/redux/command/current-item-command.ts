import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * Basisklasse von Commands zum Setzen des aktuellen Items
 * Die Klasse wird verwendet, um z.B. bei Selektoren das Kommando NICHT über dispatch an
 * Parentstores zu delegieren!
 *
 * @export
 * @class CurrentItemCommand
 * @extends {ServiceCommand<T>}
 * @template T
 */
export abstract class CurrentItemCommand<T> extends ServiceCommand<T> {

  protected constructor(serviceRequests: IServiceRequests, protected item: T) {
    super(serviceRequests);
  }
}