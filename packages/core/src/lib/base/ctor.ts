/**
 * Helperinterface um generisch eine Instanz vom Typ {T} zu erzeugen.
 *
 * @export
 * @interface ICtor
 * @template T
 */
export interface ICtor<T> {

  /**
   * "Construktor" für Typ @see{T}
   *
   *  @param {any[]} [args] - Argumente
   */
  new (...args: any[]): T;
}