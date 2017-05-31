import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
//import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, Printer } from '@fluxgate/common';

import { ISessionRequest } from '../session/session-request.interface';
import { NanoService } from './nano-service';

@Service()
export class PrintService extends NanoService<IPrinter> {


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */

  public find(
    request: ISessionRequest
  ): Promise<FindResult<IPrinter>> {
    return new Promise<FindResult<IPrinter>>((resolve) => {
      const printer = new Printer('pr01');
      resolve(new FindResult([printer], -1));
    });
  }

}
