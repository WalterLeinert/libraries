import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IPrinter, IPrintTask, Printing } from '@fluxgate/common';
import { base64 } from '@fluxgate/core';

import { CoreService } from '../common/base/core-service';
import { ServiceCore } from '../common/base/service-core';
import { AppConfigService } from './app-config.service';


@Injectable()
export class PrintService extends ServiceCore {
  protected static readonly logger = getLogger(PrintService);

  constructor(http: HttpClient, private configService: AppConfigService) {
    super(http, configService.config.url, Printing.TOPIC);
  }


  /**
   * Liefert die Liste der Drucker (inkl. Infos dazu)
   *
   * @returns
   */
  public getPrinters(): Observable<IPrinter[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'getPrinters'), (log) => {
      return this.http
        .get(`${this.getUrl()}/${Printing.GET_PRINTERS}`)
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          catchError<IPrinter[], any>(this.handleError)
        );
    });
  }


  /**
   * Druckt die @param{printTask} mit den enthaltenen Optionen und Daten aus.
   *
   * @param printTask
   * @returns
   */
  public print(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'print'), (log) => {
      return this.http
        .post(`${this.getUrl()}/${Printing.PRINT}`, this.serialize(printTask), CoreService.JSON_OPTIONS)
        .pipe(
          map((response: Response) => response.json()),
          catchError(this.handleError)
        );
    });
  }

  /**
   * Erzeugt ein PDF-Dokument über die @param{printTask} mit den enthaltenen Optionen und Daten.
   *
   * @param printTask
   * @returns
   */
  public createPdf(printTask: IPrintTask): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'createPdf'), (log) => {
      log.warn(`Schnittstelle muss noch genau definiert werden`);

      return this.http
        .post(`${this.getUrl()}/${Printing.CREATE_PDF}`, this.serialize(printTask), CoreService.JSON_OPTIONS)
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          catchError(this.handleError)
        );
    });
  }

  /**
   * Transferiert den @param{report} zum Druckservice.
   *
   * @param reportName Name des Reports
   * @param report Reportdaten, base64-kodiert
   * @returns
   */
  public transferReport(reportName: string, report: base64): Observable<any> {
    return using(new XLog(PrintService.logger, levels.INFO, 'transferReport'), (log) => {

      log.warn(`Schnittstelle muss noch genau definiert werden`);

      const reportBase64 = Buffer.from(report).toString('base64');
      return this.http
        .post(`${this.getUrl()}/${Printing.TRANSFER_REPORT}?${reportName}`, this.serialize(reportBase64),
          CoreService.JSON_OPTIONS)
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          catchError(this.handleError)
        );
    });
  }

}