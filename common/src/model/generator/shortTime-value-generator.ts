import { ShortTime } from '../../types/shortTime';
import { ValueGenerator } from './value-generator';

export class ShortTimeValueGenerator extends ValueGenerator<ShortTime> {
  public static readonly INITIAL_VALUE = new ShortTime(8, 0);

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  /**
   * Erzeugt einen ShortTime-Wert (initial: @see{INITIAL_VALUE}),
   * bei dem die Minuten mit dem Index-Wert erhöht werden.
   *
   * @protected
   * @param {number} index
   * @returns {ShortTime}
   *
   * @memberOf ShortTimeValueGenerator
   */
  protected formatValue(index: number): ShortTime {
    const time = ShortTimeValueGenerator.INITIAL_VALUE;
    return ShortTime.createFromMinutes(time.toMinutes() + index);
  }
}