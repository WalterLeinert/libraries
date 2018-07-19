import { ColumnOptions } from '../decorator/columnOptions';
import { ColumnType } from '../metadata/columnTypes';

export interface IColumnMapping {

  /**
   * Propertyname im zugehörigen Modell (z.B. name bei Artikel.name)
   */
  name: string;

  /**
   * Propertytyp zur Modelproperty (name)
   */
  propertyType?: ColumnType;

  /**
   * Die Options vom Column-Decorator
   */
  options: ColumnOptions;
}