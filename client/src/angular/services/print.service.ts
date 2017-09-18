import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  ColumnTypes, IPrinter, IPrintOptions, IPrintTask, ITableRow,
  Printing, ServiceConstants, TableMetadata, TableType
} from '@fluxgate/common';
import { Assert, Core } from '@fluxgate/core';

import { CoreService } from '../common/base/core-service';
import { ServiceCore } from '../common/base/service-core';
import { AppConfigService } from './app-config.service';
import { MetadataService } from './metadata.service';


@Injectable()
export class PrintService extends ServiceCore {
  protected static readonly logger = getLogger(PrintService);

  // TODO: public static readonly TOPIC = 'print';
  public static readonly TOPIC = 'json?id=221';
  public static readonly TOPIC_PRINTERS = 'printers';

  constructor(http: Http, private metadataService: MetadataService, private configService: AppConfigService) {
    super(http, configService.config.printUrl, configService.config.printTopic);
  }

  /**
   * Druckt die @param{printTask} mit den enthaltenen Optionen und Daten aus.
   *
   * @template TTable
   * @param {IPrintTask} printTask
   * @returns {Observable<any>}
   *
   * @memberof PrintService
   */
  public createReport<TTable>(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createReport'), (log) => {
      return this.http
        .post(`${this.getUrl()}/${Printing.CREATE_REPORT}`, this.serialize(printTask), CoreService.JSON_OPTIONS)
        .map((response: Response) => this.deserialize(response.json()))
        .catch(this.handleError);
    });
  }


  /**
   * Liefert die Liste der Drucker (inkl. Infos dazu)
   *
   * @returns {Observable<IPrinter[]>}
   * @memberof PrintService
   */
  public getPrinters(): Observable<IPrinter[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'getPrinters'), (log) => {
      return this.http
        .get(`${this.getUrl()}/${Printing.GET_PRINTERS}`)
        .map((response: Response) => this.deserialize(response.json()))
        .catch(this.handleError);
    });
  }

}
