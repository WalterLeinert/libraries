import { Injector, Inject } from 'injection-js';

import { Service } from 'ts-express-decorators';
const http = require('https');

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, Printer } from '@fluxgate/common';

import { ISessionRequest } from '../../session/session-request.interface';
import { ServiceCore } from '../service-core';
import { ServerConfigurationService } from '../server-configuration.service';
import { IPrintServiceOptions } from './print-service-options.interface';


/**
 * Service zur Kommunikation mit dem Fluxgate Druck-/Formatierservice
 *
 * @export
 * @class PrintService
 * @extends {ServiceCore}
 */
@Service()
export class PrintService extends ServiceCore {
  protected static readonly logger = getLogger(PrintService);

  constructor(private configurationService: ServerConfigurationService) {
    super();

    using(new XLog(PrintService.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`configuration = ${JSON.stringify(configurationService.get())}`);
    });
  }

  private options: IPrintServiceOptions = {
    host: 'localhost',
    path: '/rest/info?GetPrinters',
    port: 8881,
    method: 'POST',
    json: true,
    rejectUnauthorized: false,
    requestCert: true
  };


  /**
   * Liefert alle Druckerinfos.
   *
   * @returns {Promise<IPrinter[]>}
   *
   * @memberOf PrintService
   */

  public getPrinters(
    request: ISessionRequest
  ): Promise<IPrinter[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'find'), (log) => {
      return new Promise<IPrinter[]>((resolve) => {

        const printConfiguration = this.configurationService.get().print;
        log.log(`printConfiguration = ${JSON.stringify(printConfiguration)}`);

        http.get(printConfiguration, (res) => {
          const bodyChunks = [];
          res.on('data', (chunk) => {
            bodyChunks.push(chunk);
          }).on('end', () => {
            const body = Buffer.concat(bodyChunks);
            const printers = JSON.parse(body.toString()) as IPrinter[];
            resolve(printers);
          });
        });

        // TODO: fake
        // const printer = new Printer('pr01');
        // resolve([printer]);
      });
    });
  }

}