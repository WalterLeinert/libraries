// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, Core, Types } from '@fluxgate/core';

import { ColumnTypes } from '../model/metadata/columnTypes';
import { MetadataStorage } from '../model/metadata/metadataStorage';
import { TableMetadata } from '../model/metadata/tableMetadata';
import { IPrintOptions } from './model/printOptions.interface';
import { IPrintTask } from './model/printTask.interface';
import { ITableRow } from './model/tableRow.interface';
import { TableType } from './model/tableType.enum';


export class Printing {
  protected static readonly logger = getLogger(Printing);

  /**
   * REST-Api: Topic, welches die Url aufbaut
   */
  public static TOPIC = 'printing';

  /**
   * REST-Api: verb zum Holen der Druckerliste (z.B. /rest/printing/getPrinters)
   */
  public static GET_PRINTERS = 'getPrinters';

  /**
   * REST-Api: verb zum Übertragen eines Reports an den Druckservice (RemoteAgent)
   * (z.B. /rest/printing/transferReport)
   */
  public static TRANSFER_REPORT = 'transferReport';

  /**
   * REST-Api: verb zum Ausdruck (z.B. /rest/printing/print)
   */
  public static PRINT = 'print';

  /**
   * REST-Api: verb zum Erzeugen eines PDF-Dokuments (z.B. /rest/printing/createPdf)
   */
  public static CREATE_PDF = 'createPdf';


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
  public static createPrintTask<TMaster, TDetail>(formName: string, printOptions: IPrintOptions, master: TMaster,
    details: TDetail[]): IPrintTask {

    Assert.notNull(master);
    Assert.notNull(details);

    return using(new XLog(Printing.logger, levels.INFO, 'createPrintTask',
      `formName = ${formName}, printOptions = ${Core.stringify(printOptions)}`), (log) => {

        const masterMetadata = MetadataStorage.instance.findTableMetadata(master.constructor);

        const masterData = this.createTableRecords(masterMetadata, master);

        const masterFields = masterMetadata.columnMetadata.map((item) => {
          return {
            name: item.propertyName,
            type: item.propertyType
          };
        });

        const data = [
          {
            table: masterMetadata.className,
            records: masterData
          }
        ];

        const tables = [
          {
            name: masterMetadata.className,
            type: TableType.Master,
            fields: masterFields
          }
        ];

        let detailsData = [];
        let detailFields = [];

        if (!Types.isNullOrEmpty(details)) {
          const detailMetadata = MetadataStorage.instance.findTableMetadata(details[0].constructor);

          detailsData = this.createTableRecords(detailMetadata, details);

          detailFields = detailMetadata.columnMetadata.map((item) => {
            return {
              name: item.propertyName,
              type: item.propertyType
            };
          });

          data.push(
            {
              table: detailMetadata.className,
              records: detailsData
            }
          );

          tables.push(
            {
              name: detailMetadata.className,
              type: TableType.Detail,
              fields: detailFields
            }
          );
        }


        const printTask: IPrintTask = {
          report: formName,
          tables: tables,
          printJobs: [
            {
              options: printOptions,
              data: data
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
  private static createTableRecords<TTable>(tableMetadata: TableMetadata, tableData: TTable[] | TTable): ITableRow[] {
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
}
