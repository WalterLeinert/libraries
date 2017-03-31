import { IFieldInfo } from './fieldInfo.interface';
import { TableType } from './tableType.enum';

/**
 * Infos zu einer Tabelle
 *
 * @export
 * @interface ITableInfo
 */
export interface ITableInfo {

  /**
   * Tabellenname
   *
   * @type {string}
   * @memberOf ITableInfo
   */
  name: string;

  /**
   * Tabellentyp
   *
   * @type {TableType}
   * @memberOf ITableInfo
   */
  type: TableType;

  /**
   * Infos zu den Feldern
   *
   * @type {IFieldInfo[]}
   * @memberOf ITableInfo
   */
  fields: IFieldInfo[];
}

