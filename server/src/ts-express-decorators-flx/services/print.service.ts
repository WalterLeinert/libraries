import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
// import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter } from '@fluxgate/common';

import { ISessionRequest } from '../session/session-request.interface';
import { ServiceCore } from './service-core';

@Service()
export class PrintService extends ServiceCore {


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

      // var req = http.get(options, function (res) {
      //     var bodyChunks = [];
      //     res.on('data', function (chunk) {
      //         bodyChunks.push(chunk);
      //     }).on('end', function () {
      //         var body = Buffer.concat(bodyChunks);

      //         myreturn = JSON.parse(body.toString());
      const printers: IPrinter[] = [];
      resolve(new FindResult(printers, undefined));

      //     })
      // });
      // const printer = new Printer('pr01');
      // resolve(new FindResult([printer], -1));
    });
  }

}
