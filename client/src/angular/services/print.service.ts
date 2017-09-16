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

import { ServiceCore } from '../common/base/service-core';
import { AppConfigService } from './app-config.service';
import { MetadataService } from './metadata.service';


@Injectable()
export class PrintService extends ServiceCore {
  protected static readonly logger = getLogger(PrintService);

  // TODO: public static readonly TOPIC = 'print';
  public static readonly TOPIC = 'json?id=221';
  public static readonly TOPIC_PRINTERS = 'printers';

  public static readonly JSON_HEADERS = new Headers({
    'Content-Type': 'application/json'
  });

  public options: RequestOptions;

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
   * @memberOf PrintService
   */
  public print<TTable>(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'print'), (log) => {
      const options = new RequestOptions({ headers: PrintService.JSON_HEADERS });

      // const printData = printTask;
      const printData = Core.stringify(printTask);

      return this.http
        .post(this.getUrl(), printData, options)
        .map(this.extractData)
        .catch(this.handleError);
    });
  }


  public getPrinters(): Observable<IPrinter[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'getPrinters'), (log) => {
      return this.http
        .get(`${this.getUrl()}/${ServiceConstants.FIND}`)
        .map((response: Response) => this.deserialize(response.json()))
        .catch(this.handleError);
    });
  }


  private extractData(res: Response) {
    const body = res;
    return body;
  }

}
