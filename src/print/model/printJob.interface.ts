import { IPrintOptions } from './printOptions.interface';
import { ITableData } from './tableData.interface';

/**
 * ein Printjob mit Durckoptionen und Daten
 *
 * @export
 * @interface IPrintjob
 */
export interface IPrintJob {
  /**
   * Druckoptionen
   *
   * @type {IPrintOptions}
   * @memberOf IPrintJob
   */
  options: IPrintOptions;

  /**
   * Tabellendatenfür Ausdruck
   *
   * @type {ITableData[]}
   * @memberOf IPrintJob
   */
  data: ITableData[];
}
