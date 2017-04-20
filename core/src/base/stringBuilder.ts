import { Constants } from './constants';

/**
 * Einfache StringBuilder Implentierung
 *
 * @export
 * @class StringBuilder
 */
export class StringBuilder {
  private strings: string[] = [];

  /**
   * Creates an instance of StringBuilder.
   *
   * @param {string} [text]
   *
   * @memberOf StringBuilder
   */
  constructor(text?: string) {
    if (text) {
      this.strings.push(text);
    }
  }

  /**
   * Fügt den angegeben Text hinzu.
   *
   * @param {string} text
   *
   * @memberOf StringBuilder
   */
  public append(text: string) {
    this.strings.push(text);
  }


  /**
   * Falls der StringBuilder noch leer ist, wird vor dem @param{text}
   * der Delimiter @param{delimiter} eingefügt.
   *
   * @param {string} text
   * @param {string} [delimiter=', ']
   *
   * @memberOf StringBuilder
   */
  public appendWithDelimiter(text: string, delimiter = ', ') {
    if (!this.isEmpty) {
      this.append(delimiter);
    }
    this.strings.push(text);
  }

  /**
   * Fügt den angegeben Text hinzu und hängt ein EOL an.
   *
   * @param {string} [text]
   *
   * @memberOf StringBuilder
   */
  public appendLine(text?: string) {
    this.append(text + Constants.EOL);
  }

  /**
   * Liefert den kompletten Text als @see{string}
   *
   * @returns {string}
   *
   * @memberOf StringBuilder
   */
  public toString(): string {
    return this.strings.join('');
  }


  /**
   * Liefert true, falls der StringBuilder noch leer ist.
   *
   * @readonly
   * @type {boolean}
   * @memberOf StringBuilder
   */
  public get isEmpty(): boolean {
    return this.strings.length <= 0;
  }
}