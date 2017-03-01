import { ITableRow } from './tableRow.interface';

/**
 * konkrete Tabellendaten
 *
 * @export
 * @interface ITableData
 */
export interface ITableData {
  /**
   * Name der Tabelle
   *
   * @type {string}
   * @memberOf ITableData
   */
  table: string;

  /**
   * Tabellenzeilen (als)
   *
   * @type {{ [key: string]: any }}
   * @memberOf ITableData
   */
  records: ITableRow[];
}
