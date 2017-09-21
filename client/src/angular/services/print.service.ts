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
import { Assert, base64, Core } from '@fluxgate/core';

import { CoreService } from '../common/base/core-service';
import { ServiceCore } from '../common/base/service-core';
import { AppConfigService } from './app-config.service';
import { MetadataService } from './metadata.service';


@Injectable()
export class PrintService extends ServiceCore {
  protected static readonly logger = getLogger(PrintService);

  constructor(http: Http, private metadataService: MetadataService, private configService: AppConfigService) {
    super(http, configService.config.url, Printing.TOPIC);
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


  /**
   * Druckt die @param{printTask} mit den enthaltenen Optionen und Daten aus.
   *
   * @param {IPrintTask} printTask
   * @returns {Observable<any>}
   *
   * @memberof PrintService
   */
  public print(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'print'), (log) => {
      return this.http
        .post(`${this.getUrl()}/${Printing.PRINT}`, this.serialize(printTask), CoreService.JSON_OPTIONS)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    });
  }

  /**
   * Erzeugt ein PDF-Dokument über die @param{printTask} mit den enthaltenen Optionen und Daten.
   *
   * @param {IPrintTask} printTask
   * @returns {Observable<any>}
   *
   * @memberof PrintService
   */
  public createPdf(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createPdf'), (log) => {
      log.warn(`Schnittstelle muss noch genau definiert werden`);

      return this.http
        .post(`${this.getUrl()}/${Printing.CREATE_PDF}`, this.serialize(printTask), CoreService.JSON_OPTIONS)
        .map((response: Response) => this.deserialize(response.json()))
        .catch(this.handleError);
    });
  }

  /**
   * Transferiert den @param{report} zum Druckservice.
   *
   * @param {string} reportName Name des Reports
   * @param {base64} report Reportdaten, base64-kodiert
   * @returns {Observable<any>}
   *
   * @memberof PrintService
   */
  public transferReport(reportName: string, report: base64): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'transferReport'), (log) => {

      log.warn(`Schnittstelle muss noch genau definiert werden`);

      const reportBase64 = Buffer.from(report).toString('base64');
      return this.http
        .post(`${this.getUrl()}/${Printing.TRANSFER_REPORT}?${reportName}`, this.serialize(reportBase64),
        CoreService.JSON_OPTIONS)
        .map((response: Response) => this.deserialize(response.json()))
        .catch(this.handleError);
    });
  }

}