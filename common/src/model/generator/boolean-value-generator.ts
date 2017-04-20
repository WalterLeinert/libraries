import { ValueGenerator } from './value-generator';

export class BooleanValueGenerator extends ValueGenerator<boolean> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  /**
   * Erzeugt einen Boolean-Wert, der für geraden Indexwert true ist.
   *
   * @protected
   * @param {number} index
   * @returns {boolean}
   *
   * @memberOf BooleanValueGenerator
   */
  protected formatValue(index: number): boolean {
    return (index % 2) === 0;
  }
}