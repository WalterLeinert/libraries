import { Assert } from '@fluxgate/core';

import { ValueGenerator } from './value-generator';


/**
 * Generator, der Stringvalues aus einer vorgegeben Liste liefert.
 *
 * @export
 * @class StringValueListGenerator
 * @extends {ValueGenerator<string>}
 */
export class StringValueListGenerator extends ValueGenerator<string> {

  /**
   * Creates an instance of StringValueListGenerator.
   *
   * @param {string[]} values - Werteliste
   * @param {Iterator<number>} strategy
   *
   * @memberof StringValueListGenerator
   */
  constructor(private values: string[], strategy: Iterator<number>) {
    super(strategy);
    Assert.notNullOrEmpty(values);
  }

  protected formatValue(index: number): string {
    Assert.that(index >= 0 && index < this.values.length);
    return this.values[index];
  }
}