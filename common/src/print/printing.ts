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


export interface ITablePrintInfo<T> {
  rows: T[];
  columns?: string[];
}


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
   * Erzeugt eine @param{IPrintTask} mit den angegebene Parametern.
   * Die Daten der "flachen" Liste sind in @param{tableInfo} enthalten.
   *
   * @static
   * @template TTable
   * @param {string} formName
   * @param {IPrintOptions} printOptions
   * @param {ITablePrintInfo<TTable>} tableInfo
   * @returns {IPrintTask}
   * @memberof Printing
   */
  public static createPrintTask<TTable>(formName: string, printOptions: IPrintOptions,
    tableInfo: ITablePrintInfo<TTable>): IPrintTask {
    return Printing.createPrintTaskMasterDetails(formName, printOptions, tableInfo);
  }


  /**
   * Erzeugt eine @param{IPrintTask} mit den angegebene Parametern
   * Die Tabellendaten @param{details} fehlen, falls nur eine "flache" Liste gedruckt werden soll;
   * die Daten dieser "flachen" Liste sind dann in @param{master} enthalten.
   *
   * @template TMaster - Mastertable
   * @template TDetail - Detailtables
   * @param {string} formName - Formularname
   * @param {IPrintOptions} printOptions
   * @param {ITablePrintInfo<TMaster>} master Master Druckinfos
   * @param {ITablePrintInfo<TDetail>} details Details Druckinfos
   * @returns {IPrintTask}
   *
   * @memberOf PrintService
   */
  public static createPrintTaskMasterDetails<TMaster, TDetail>(formName: string, printOptions: IPrintOptions,
    master: ITablePrintInfo<TMaster>, details?: ITablePrintInfo<TDetail>): IPrintTask {

    Assert.notNull(master);
    Assert.notNullOrEmpty(master.rows);

    return using(new XLog(Printing.logger, levels.INFO, 'createPrintTask',
      `formName = ${formName}, printOptions = ${Core.stringify(printOptions)}`), (log) => {

        const masterResult = Printing.createTableInfo(master, TableType.Master);

        const data = masterResult.data;
        const tables = masterResult.tables;

        if (Types.isPresent(details)) {
          Assert.notNullOrEmpty(details.rows);

          const detailResult = Printing.createTableInfo(details, TableType.Detail);

          data.push(...detailResult.data);
          tables.push(...detailResult.tables);
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
   * Erzeugt die Druckinformationen für die Felder und die Daten für @param{printInfo} und
   * den Tabellentyp @param{tableType}.
   *
   * @private
   * @static
   * @template TTable
   * @param {ITablePrintInfo<TTable>} printInfo
   * @param {TableType} tableType
   * @returns
   * @memberof Printing
   */
  private static createTableInfo<TTable>(printInfo: ITablePrintInfo<TTable>, tableType: TableType) {
    const tableMetadata = MetadataStorage.instance.findTableMetadata(printInfo.rows[0].constructor);

    //
    // Set für Spaltenfilter aufbauen: default -> alle Spalten aus Metadaten
    //
    let tableColumns: Set<string> = new Set(tableMetadata.columnMetadata.map((item) => {
      return item.propertyName;
    }));

    if (!Types.isNullOrEmpty(printInfo.columns)) {
      tableColumns = new Set(printInfo.columns);
    }

    const tableFields = tableMetadata.columnMetadata
      .filter((item) => {
        return tableColumns.has(item.propertyName);
      })
      .map((item) => {
        return {
          name: item.propertyName,
          type: item.propertyType
        };
      });

    const tableRecords = this.createTableRecords(tableMetadata, printInfo, tableColumns);


    const data = [
      {
        table: tableMetadata.className,
        records: tableRecords
      }
    ];

    const tables = [
      {
        name: tableMetadata.className,
        type: tableType,
        fields: tableFields
      }
    ];

    return {
      data: [
        {
          table: tableMetadata.className,
          records: tableRecords
        }
      ],

      tables: [
        {
          name: tableMetadata.className,
          type: tableType,
          fields: tableFields
        }
      ]
    };
  }


  /**
   * Erzeugt für die Tabelle mit dem Metadaten @param{tableMetadata} und den Tabellendaten @param{tableData}
   * ein Array von @see{iTableRow}. Die Daten werden über @param{tableColumns} gefiltert.
   *
   * @private
   * @template TTable
   * @param {TableMetadata} tableMetadata
   * @param {TTable[]} tableData
   * @param {Set<string>} tableColumns
   * @returns {ITableRow[]}
   *
   * @memberOf PrintComponent
   */
  private static createTableRecords<TTable>(tableMetadata: TableMetadata, tableData: ITablePrintInfo<TTable>,
    tableColumns: Set<string>): ITableRow[] {
    const records: ITableRow[] = [];

    const tableRows: TTable[] = [...tableData.rows];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tableRows.length; i++) {
      const rowData: ITableRow = {};

      tableMetadata.columnMetadata.forEach((item) => {
        const key = item.propertyName;

        //
        // Daten nach Spalten filtern
        //
        if (tableColumns.has(key)) {
          if (item.propertyType === ColumnTypes.SHORTTIME) {
            rowData[key] = tableRows[i][key].toString();
          } else {
            rowData[key] = tableRows[i][key];
          }
        }
      });

      records.push(rowData);
    }

    return records;
  }
}
