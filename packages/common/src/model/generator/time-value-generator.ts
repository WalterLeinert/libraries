import { Time } from '@fluxgate/core';

import { ValueGenerator } from './value-generator';

export class TimeValueGenerator extends ValueGenerator<Time> {
  public static readonly INITIAL_VALUE = new Time(14, 0, 0);

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  /**
   * Erzeugt einen ShortTime-Wert (initial: @see{INITIAL_VALUE}),
   * bei dem die Sekunden mit dem Index-Wert erhöht werden.
   *
   * @protected
   * @param {number} index
   * @returns {ShortTime}
   *
   * @memberOf TimeValueGenerator
   */
  protected formatValue(index: number): Time {
    const time = TimeValueGenerator.INITIAL_VALUE;
    return Time.createFromSeconds(time.toSeconds() + index);
  }
}