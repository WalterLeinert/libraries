import { IdColumnOptions } from './idColumnOptions';


/**
 * Optionen für den Column-Decorator: ergänzt die Optionen der IdColumn um die Properties
 * primary und generated.
 *
 * @export
 * @interface ColumnOptions
 */
// tslint:disable-next-line:interface-name
export interface ColumnOptions extends IdColumnOptions {

  /**
   * Spalte ist primary key.
   */
  readonly primary?: boolean;

  /**
   * Autoinkrement wird für Spalte verwendet.
   * Nur für eine einzige Spalte möglich und Spalte muss primary key sein.
   */
  readonly generated?: boolean;

}