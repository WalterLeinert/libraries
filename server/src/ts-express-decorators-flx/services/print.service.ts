import { Inject, Injector } from 'injection-js';

import * as path from 'path';
import * as httpRequest from 'request';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  FindResult, IPrinter, IPrintServiceOptions, IPrintTask, PrintAgentClient,
  Printer, Printing, RestMethods
} from '@fluxgate/common';
import { base64, Core, NotImplementedException, StringBuilder, Types } from '@fluxgate/core';
import { FileSystem } from '@fluxgate/platform';

import { ISessionRequest } from '../session/session-request.interface';
import { ServerConfigurationService } from './server-configuration.service';
import { ServiceCore } from './service-core';


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
        const printHelper = new PrintAgentClient(this.configurationService.get().print);
        return printHelper.getPrinters();
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
      if (log.isEnabled()) {
        log.log(`printTask: ${Core.stringify(printTask)}`);
      }

      const printHelper = new PrintAgentClient(this.configurationService.get().print);
      return printHelper.print(printTask);
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


}