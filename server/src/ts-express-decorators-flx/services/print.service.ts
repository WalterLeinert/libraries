import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter } from '@fluxgate/common';

import { ISessionRequest } from '../session/session-request.interface';
import { ServiceCore } from './service-core';

@Service()
export class PrintService extends ServiceCore {

  private options = {
    host: 'localhost',
    path: '/rest/info?GetPrinters',
    port: 8881,
    method: 'POST',
    json: true,
    rejectUnauthorized: false,
    requestCert: true,
  };


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */

  public find(
    request: ISessionRequest
  ): Promise<FindResult<IPrinter[]>> {
    return new Promise<FindResult<IPrinter[]>>((resolve) => {
      const http = require('https');
      http.get(this.options, (res) => {
        const bodyChunks = [];
        res.on('data', (chunk) => {
          bodyChunks.push(chunk);
        }).on('end', () => {
          const body = Buffer.concat(bodyChunks);
          const printers = JSON.parse(body.toString()) as IPrinter[];
          resolve(new FindResult([printers], undefined));

        });
      });
      // const printer = new Printer('pr01');
      // resolve(new FindResult([printer], -1));
    });
  }

}
