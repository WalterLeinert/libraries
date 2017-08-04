/**
 * Optionen für Tabledecorator
 *
 * @export
 * @interface TableOptions
 */
// tslint:disable-next-line:interface-name
export interface TableOptions {
  /**
   * DB Tabellen-/Viewname
   */
  name?: string;

  /**
   * true, falls View und keine Tabelle
   */
  isView?: boolean;

  /**
   * true, falls die Tabelle nur eine abstrakte Basisklasse hat
   */
  isAbstract?: boolean;
}