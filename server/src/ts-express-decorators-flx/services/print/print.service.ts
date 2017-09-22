import { Inject, Injector } from 'injection-js';

import * as path from 'path';
import * as httpRequest from 'request';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { FindResult, IPrinter, IPrintTask, Printer, Printing } from '@fluxgate/common';
import { base64, Core, NotImplementedException, StringBuilder, Types } from '@fluxgate/core';
import { FileSystem } from '@fluxgate/platform';

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


        const options = this.createOptions(log, printConfiguration, false, 'info', 'GetPrinters');
        log.log(`options = ${Core.stringify(options)}`);

        httpRequest(options, (err, res, body) => {
          if (err) {
            log.error(err);
            reject(err);
          } else {
            log.log(`body = ${body}`);
            const rval = Printing.convertPrinterFromRemoteAgent(JSON.parse(body).printers);
            resolve(rval);
          }

        });

        // TODO: fake
        // const printer = new Printer('pr01');
        // resolve([printer]);
      });
    });
  }



  /**
   * Erzeugt einen Ausdruck mit den Daten/Optionen in @param{printTask}
   *
   * @param {ISessionRequest} request
   * @param {IPrintTask} printTask
   * @returns {Promise<any>}
   * @memberof PrintService
   */
  public print(
    request: ISessionRequest,
    printTask: IPrintTask
  ): Promise<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'print'), (log) => {
      return new Promise<any>((resolve, reject) => {

        if (log.isEnabled()) {
          log.log(`printTask: ${Core.stringify(printTask)}`);
        }

        const printConfiguration = this.configurationService.get().print;
        log.log(`printConfiguration = ${Core.stringify(printConfiguration)}`);


        const options = this.createOptions(log, printConfiguration, true, 'json', 'dummy.json');
        (options as any).body = printTask;    // TODO
        log.log(`options = ${Core.stringify(options)}`);

        httpRequest(options, (err, res, body) => {
          if (err) {
            log.error(err);
            reject(err);
          } else {
            log.log(`body = ${Core.stringify(body)}`);
            // const rval = JSON.parse(body);
            resolve(body);
          }
        });
      });
    });
  }


  /**
   * Erzeugt einen Ausdruck mit den Daten/Optionen in @param{printTask}
   *
   * @param {ISessionRequest} request
   * @param {IPrintTask} printTask
   * @returns {Promise<any>}
   * @memberof PrintService
   */
  public createPdf(
    request: ISessionRequest,
    printTask: IPrintTask
  ): Promise<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createPdf'), (log) => {
      throw new NotImplementedException();
    });
  }


  /**
   * Erzeugt einen Ausdruck mit den Daten/Optionen in @param{printTask}
   *
   * @param {ISessionRequest} request
   * @param {base64} report
   * @returns {Promise<any>}
   * @memberof PrintService
   */
  public transferReport(
    request: ISessionRequest,
    reportName: string,
    report: base64
  ): Promise<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'transferReport', `reportName = ${reportName}`), (log) => {
      throw new NotImplementedException();
    });
  }

  private createUrl(options: IPrintServiceOptions, type: string, verb?: string): string {
    const sb = new StringBuilder(`https://${options.host}:${options.port}`);
    sb.append(PrintService.URL_PREFIX);
    sb.append(type);

    if (Types.isPresent(verb)) {
      sb.append('?' + verb);
    }

    return sb.toString();
  }



  private createOptions(log: XLog, printConfiguration: IPrintServiceOptions, json: boolean, type: string, arg: string) {

    const errorLogger = (message: string): void => {
      log.error(message);
    };

    const cert = FileSystem.readTextFile(errorLogger, printConfiguration.agentOptions.certPath, 'Zertifikat');
    const key = FileSystem.readTextFile(errorLogger, printConfiguration.agentOptions.keyPath, 'Private Key');
    const ca = FileSystem.readTextFile(errorLogger, printConfiguration.agentOptions.caPath, 'ca');


    const options = {
      url: this.createUrl(printConfiguration, type, arg),
      method: RestMethods.POST,
      json: json,
      agentOptions: {
        cert: cert,
        key: key,
        ca: ca,
        rejectUnauthorized: printConfiguration.agentOptions.rejectUnauthorized
      },
      headers: {}
    };

    return options;
  }
}