import { CountingSuspendable } from './counting-suspendable';

/**
 * Hilfsklasse zum Einrücken von Text/Code. Wird zusammen mit @see{Suspender} verwendet
 *
 * @example{
 * class Sample {}
 *  private indenter = new Indenter(4);   // 4 Leerzeichen pro Einrückung
 *
 *  doTest() {
 *    using(new Suspender(this.indenter), () => {
 *      // this.indenter.getIndentation() ...
 *    });
 *  }
 * }
 *
 * @export
 * @class Indenter
 * @extends {CountingSuspendable}
 */
export class Indenter extends CountingSuspendable {
  private static readonly defaultIndentation = 2;
  private static readonly maxIndentations = 30;
  private readonly indentationLevels = new Array<string>();


  /**
   * Creates an instance of Indenter.
   * @param {number} [indentation=Indenter.defaultIndentation]
   *
   * @memberof Indenter
   */
  constructor(indentation: number = Indenter.defaultIndentation) {
    super();

    let indentString = '';
    for (let j = 0; j < indentation; j++) {
      indentString = indentString + ' ';
    }
    let indent = '';

    for (let i = 0; i < Indenter.maxIndentations; i++) {
      // console.log('initialize: i = ' + i + ', indent = \'' + indent + '\'' );
      this.indentationLevels.push(indent);
      indent = indent + indentString;
    }
  }

  /**
   * Liefert die aktuelle Indentation (String mit (this.Counter * indentation) Leerzeichen)
   *
   * @returns {string}
   *
   * @memberof Indenter
   */
  public getIndentation(): string {
    return this.indentationLevels[this.Counter];
  }
}