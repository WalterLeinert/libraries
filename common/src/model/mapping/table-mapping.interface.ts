import { TableOptions } from '../decorator/model/tableOptions.interface';
import { IColumnMapping } from './column-mapping.interface';

export interface ITableMapping {
  /**
   * Klassennamen des zugehörigen Modells (z.B. 'Artikel')
   */
  name: string;

  /**
   * Die Options vom Table-Decorator
   */
  options: TableOptions;

  /**
   * Die Spaltenmappings
   */
  columns: IColumnMapping[];
}