/**
 * Optionen fürs Drucken/Formatieren
 *
 * @export
 * @interface IPrintOptions
 */
export interface IPrintOptions {

  /**
   * Name des Ausdrucks
   *
   * @type {string}
   * @memberOf IPrintOptions
   */
  title: string;

  /**
   *
   *
   * @type {string}
   * @memberOf IPrintOptions
   */
  docSize?: string;

  /**
   * Druckername
   *
   * @type {string}
   * @memberOf IPrintOptions
   */
  printer?: string;

  /**
   * Ausdruck in Farbe?
   *
   * @type {boolean}
   * @memberOf IPrintOptions
   */
  color?: boolean;

  /**
   * Anzahl der Ausdrucke
   *
   * @type {number}
   * @memberOf IPrintOptions
   */
  copies?: number;
}
