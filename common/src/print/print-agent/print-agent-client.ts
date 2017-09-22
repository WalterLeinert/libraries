import * as path from 'path';
import * as httpRequest from 'request';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, Core, Funktion, StringBuilder, Types } from '@fluxgate/core';
import { FileSystem } from '@fluxgate/platform';

import { IPrinter } from '../model/printer.interface';
import { IPrintTask } from '../model/printTask.interface';
import { Printing } from '../printing';
import { IPrintServiceOptions, RestMethods } from './print-service-options.interface';


/**
 * Realisiert die Kommunikation mit dem PrintAgent (RemoteAgent.exe)
 *
 * @export
 * @class PrintAgentClient
 */
export class PrintAgentClient {
  protected static readonly logger = getLogger(PrintAgentClient);
  public static readonly URL_PREFIX = '/rest/';

  constructor(private printConfiguration: IPrintServiceOptions) {
    using(new XLog(PrintAgentClient.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`printConfiguration = ${Core.stringify(printConfiguration)}`);
    });
  }


  /**
   * Liefert die Liste der Drucker mit den verfügbaren Eigenschaften.
   *
   * @returns {Promise<IPrinter[]>}
   * @memberof PrintingHelper
   */
  public getPrinters(): Promise<IPrinter[]> {
    return using(new XLog(PrintAgentClient.logger, levels.INFO, 'getPrinters'), (log) => {
      return new Promise<IPrinter[]>((resolve, reject) => {

        const options = this.createOptions(log, this.printConfiguration, false, 'info', 'GetPrinters');
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
      });
    });
  }


  /**
   * Erzeugt den Ausdruck für die angegebene @param{printTask}
   *
   * @param {IPrintTask} printTask
   * @returns {Promise<any>}
   * @memberof PrintingHelper
   */
  public print(printTask: IPrintTask): Promise<any> {
    return using(new XLog(PrintAgentClient.logger, levels.INFO, 'print'), (log) => {

      return new Promise<any>((resolve, reject) => {
        log.log(`printConfiguration = ${Core.stringify(this.printConfiguration)}`);
        const options = this.createOptions(log, this.printConfiguration, true, 'json', 'dummy.json');

        (options as any).body = printTask; // TODO
        log.log(`options = ${Core.stringify(options)}`);

        httpRequest(options, (err, res, body) => {
          if (err) {
            log.error(err);
            reject(err);
          } else {
            log.log(`body = ${Core.stringify(body)}`);
            resolve(body);
          }
        });
      });
    });
  }



  /**
   * Erzeugt eine REST-Url für eine bestimmte Aktion.
   *
   * @private
   * @param {IPrintServiceOptions} options
   * @param {string} type Aktionstyp
   * @param {string} [verb]
   * @returns {string}
   * @memberof PrintingHelper
   */
  private createUrl(options: IPrintServiceOptions, type: string, verb?: string): string {
    const sb = new StringBuilder(`https://${options.host}:${options.port}`);
    sb.append(PrintAgentClient.URL_PREFIX);
    sb.append(type);

    if (Types.isPresent(verb)) {
      sb.append('?' + verb);
    }

    return sb.toString();
  }


  /**
   * Erzeugt die aktionsspezifischen Options.
   *
   * @private
   * @param {XLog} log
   * @param {IPrintServiceOptions} printConfiguration
   * @param {boolean} json
   * @param {string} type
   * @param {string} arg
   * @returns
   * @memberof PrintingHelper
   */
  private createOptions(log: XLog, printConfiguration: IPrintServiceOptions, json: boolean, type: string,
    arg: string): any {

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