import { ColumnType } from '../metadata/columnTypes';


/**
 * Optionen für den Column-Decorator
 *
 * @export
 * @interface ColumnOptions
 */
// tslint:disable-next-line:interface-name
export interface ColumnOptions {

  /**
   * Workaround für Metadata-Problem mit Date: Typ der Property
   */
  propertyType?: ColumnType;

  /**
   * Anzeigename (z.B. auf einer Form)
   * Ist displayName nicht definiert, wird standardmäßig die Spalte nicht angzeigt.
   */
  displayName?: string;

  /**
   * DB-Spaltenname
   */
  name?: string;

  /**
   * Typ
   */
  type?: ColumnType;

  /**
   * Spalte ist primary key.
   */
  readonly primary?: boolean;

  /**
   * Autoinkrement wird für Spalte verwendet.
   * Nur für eine einzige Spalte möglich und Spalte muss primary key sein.
   */
  readonly generated?: boolean;

  /**
   * Spaltenwerte sind unique
   */
  readonly unique?: boolean;

  /**
   * Spaltenwert kann null sein.
   */
  nullable?: boolean;

  /**
   * Column comment.
   */
  readonly comment?: string;

  /**
   * Defaultwert.
   */
  readonly default?: any;

  /**
   * false: Spaltenwert wird nicht persistiert (default: true); z.B. berechnete Property
   */
  persisted?: boolean;
}