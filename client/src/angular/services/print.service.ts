import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { ColumnTypes, IPrintOptions, IPrintTask, ITableRow, TableMetadata, TableType } from '@fluxgate/common';
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


  public getPrinters(): Observable<string[]> {
    return using(new XLog(PrintService.logger, levels.INFO, 'getPrinters'), (log) => {
      return this.http
        .get(`${this.getUrl()}/${PrintService.TOPIC_PRINTERS}`)
        .map(this.extractData)
        .catch(this.handleError);
    });
  }


  /**
   * Erzeugt eine @param{IPrintTask} mit den angegebene Parametern
   *
   * @template TMaster - Mastertable
   * @template TDetail - Detailtables
   * @param {string} formName - Formularname
   * @param {IPrintOptions} printOptions
   * @param {TMaster} master
   * @param {TDetail[]} details
   * @returns {IPrintTask}
   *
   * @memberOf PrintService
   */
  public createPrintTask<TMaster, TDetail>(formName: string, printOptions: IPrintOptions, master: TMaster,
    details: TDetail[]): IPrintTask {

    Assert.notNull(master);
    Assert.notNull(details);

    return using(new XLog(PrintService.logger, levels.INFO, 'createPrintTask',
      `formName = ${formName}, printOptions = ${Core.stringify(printOptions)}`), (log) => {

        const masterMetadata = this.metadataService.findTableMetadata(master.constructor);
        const detailMetadata = this.metadataService.findTableMetadata(details[0].constructor);

        const masterData = this.createTableRecords(masterMetadata, master);
        const detailsData = this.createTableRecords(detailMetadata, details);


        const masterFields = masterMetadata.columnMetadata.map((item) => {
          return {
            name: item.propertyName,
            type: item.propertyType
          };
        });

        const detailFields = detailMetadata.columnMetadata.map((item) => {
          return {
            name: item.propertyName,
            type: item.propertyType
          };
        });


        const printTask: IPrintTask = {
          report: formName,

          tables: [
            {
              name: masterMetadata.className,
              type: TableType.Master,
              fields: masterFields
            },
            {
              name: detailMetadata.className,
              type: TableType.Detail,
              fields: detailFields
            },

          ],
          printJobs: [
            {

              options: printOptions,
              data: [
                {
                  table: masterMetadata.className,
                  records: masterData
                },
                {
                  table: detailMetadata.className,
                  records: detailsData
                }
              ]
            }

          ]

        };

        if (log.isDebugEnabled()) {
          log.debug(`printTask = ${Core.stringify(printTask)}`);
        }

        return printTask;
      });
  }


  /**
   * Erzeugt für die Tabelle mit dem Metadaten @param{tableMetadata} und den Tabellendaten @param{tableData} ITableInfo
   * ein Array von @see{iTableRow}.
   *
   * @private
   * @template TTable
   * @param {TableMetadata} tableMetadata
   * @param {(TTable[] | TTable)} tableData
   * @returns {ITableRow[]}
   *
   * @memberOf PrintComponent
   */
  private createTableRecords<TTable>(tableMetadata: TableMetadata, tableData: TTable[] | TTable): ITableRow[] {
    const records: ITableRow[] = [];

    let tableRows: TTable[] = [];

    if (Array.isArray(tableData)) {
      tableRows = tableData as TTable[];
    } else {
      tableRows.push(tableData as TTable);
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tableRows.length; i++) {
      const rowData: ITableRow = {};

      tableMetadata.columnMetadata.forEach((item) => {
        const key = item.propertyName;

        if (item.propertyType === ColumnTypes.SHORTTIME) {
          rowData[key] = tableRows[i][key].toString();
        } else {
          rowData[key] = tableRows[i][key];
        }
      });

      records.push(rowData);
    }

    return records;
  }


  private extractData(res: Response) {
    const body = res;
    return body;
  }

}
