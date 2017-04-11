import { ValueGenerator } from './value-generator';

export class DatetimeValueGenerator extends ValueGenerator<Date> {
  public static readonly INITIAL_VALUE = new Date(2015, 10, 1, 8, 0);

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }

  /**
   * Erzeugt ein Date-Objekt mit Zeitanteil (initial: @see{INITIAL_VALUE}),
   * bei dem die Minuten mit dem Index-Wert erhöht werden.
   *
   * @protected
   * @param {number} index
   * @returns {Date}
   *
   * @memberOf DatetimeValueGenerator
   */
  protected formatValue(index: number): Date {
    const date = DatetimeValueGenerator.INITIAL_VALUE;
    date.setMinutes(date.getMinutes() + index);
    return date;
  }
}