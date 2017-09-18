import { Inject, Injector } from 'injection-js';

import * as http from 'https';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, IPrintTask, Printer } from '@fluxgate/common';

import { ISessionRequest } from '../../session/session-request.interface';
import { ServerConfigurationService } from '../server-configuration.service';
import { ServiceCore } from '../service-core';
import { IPrintServiceOptions, RestMethods } from './print-service-options.interface';


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
  public static readonly URL_PREFIX = '/rest/';

  constructor(private configurationService: ServerConfigurationService) {
    super();

    using(new XLog(PrintService.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`configuration = ${JSON.stringify(configurationService.get())}`);
    });
  }


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
    return using(new XLog(PrintService.logger, levels.INFO, 'getPrinters'), (log) => {
      return new Promise<IPrinter[]>((resolve, reject) => {

        const printConfiguration = this.configurationService.get().print;
        log.log(`printConfiguration = ${JSON.stringify(printConfiguration)}`);

        const options = {
          host: printConfiguration.host,
          path: this.createUrl('info', 'GetPrinters'),
          port: printConfiguration.port,
          method: RestMethods.POST,
          json: true,
          rejectUnauthorized: false,
          requestCert: true
        };

        http.get(options, (res) => {
          const bodyChunks = [];
          res.on('data', (chunk) => {
            bodyChunks.push(chunk);
          }).on('end', () => {
            const body = Buffer.concat(bodyChunks);
            const printers = JSON.parse(body.toString()) as IPrinter[];
            resolve(printers);
          }).on('error', (err) => {
            log.error(`error: ${err}`);
            reject(err);
          });
        });

        // TODO: fake
        // const printer = new Printer('pr01');
        // resolve([printer]);
      });
    });
  }


  public createReport(
    request: ISessionRequest,
    printTask: IPrintTask,
    filename: string
  ): Promise<IPrinter[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createReport'), (log) => {
      return new Promise<IPrinter[]>((resolve, reject) => {

        const printConfiguration = this.configurationService.get().print;
        log.log(`printConfiguration = ${JSON.stringify(printConfiguration)}`);

        const options = {
          host: printConfiguration.host,
          path: this.createUrl('json', filename),
          port: printConfiguration.port,
          method: RestMethods.POST,
          body: printTask,
          json: true,
          rejectUnauthorized: false,
          requestCert: true
        };

        http.get(options, (res) => {
          const bodyChunks = [];
          res.on('data', (chunk) => {
            bodyChunks.push(chunk);
          }).on('end', () => {
            const body = Buffer.concat(bodyChunks);
            const printers = JSON.parse(body.toString()) as IPrinter[];
            resolve(printers);
          }).on('error', (err) => {
            log.error(`error: ${err}`);
            reject(err);
          });
        });
      });
    });
  }

  private createUrl(type: string, verb: string): string {
    return PrintService.URL_PREFIX + type + '?' + verb;
  }

}