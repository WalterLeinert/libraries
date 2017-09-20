import { Inject, Injector } from 'injection-js';

import * as http from 'https';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, IPrintTask, Printer } from '@fluxgate/common';
import { Core } from '@fluxgate/core';

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
      log.log(`configuration = ${Core.stringify(configurationService.get())}`);
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
        log.log(`printConfiguration = ${Core.stringify(printConfiguration)}`);

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
            if (log.isDebugEnabled()) {
              log.debug(`data: chunk.length = ${chunk.length}, bodyChunks.length = ${bodyChunks.length}`);
            }
            bodyChunks.push(chunk);
          }).on('end', () => {
            if (log.isDebugEnabled()) {
              log.debug(`end: bodyChunks.length = ${bodyChunks.length}`);
            }
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


  // TODO: eigentlich print-Methode -> vs. createReport (PDF)
  public createReport(
    request: ISessionRequest,
    printTask: IPrintTask,
    filename: string
  ): Promise<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createReport', `filename = ${filename}`), (log) => {
      return new Promise<any>((resolve, reject) => {

        if (log.isEnabled()) {
          log.log(`printTask: ${Core.stringify(printTask)}`);
        }

        const printConfiguration = this.configurationService.get().print;
        log.log(`printConfiguration = ${Core.stringify(printConfiguration)}`);

        const options = {
          host: printConfiguration.host,
          port: printConfiguration.port,
          path: this.createUrl('json', filename),
          method: RestMethods.POST,
          body: printTask,
          json: true,
          rejectUnauthorized: false,
          requestCert: true
        };

        http.get(options, (res) => {
          const bodyChunks = [];
          res.on('data', (chunk) => {
            if (log.isDebugEnabled()) {
              log.debug(`data: chunk.length = ${chunk.length}, bodyChunks.length = ${bodyChunks.length}`);
            }
            bodyChunks.push(chunk);
          }).on('end', () => {
            if (log.isDebugEnabled()) {
              log.debug(`end: bodyChunks.length = ${bodyChunks.length}`);
            }
            const body = Buffer.concat(bodyChunks);
            const result = body.toString();
            resolve(result);
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