import { ColumnType } from '../metadata/columnTypes';


/**
 * Optionen für den IdColumn-Decorator: die Properties primary und generated werden implizit auf true gesetzt!
 *
 * @export
 * @interface IdColumnOptions
 */
// tslint:disable-next-line:interface-name
export interface IdColumnOptions {

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

  /**
   * falls true, wird die Spalte im GUI nicht angezeigt
   */
  hidden?: boolean;
}