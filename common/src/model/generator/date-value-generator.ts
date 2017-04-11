import { ValueGenerator } from './value-generator';

export class DateValueGenerator extends ValueGenerator<Date> {
  public static readonly INITIAL_VALUE = new Date(2017, 2, 1);

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }

  /**
   * Erzeugt ein Datum (initial: @see{INITIAL_VALUE}), bei dem die Tage mit dem Index-Wert erhöht werden.
   *
   * @protected
   * @param {number} index
   * @returns {Date}
   *
   * @memberOf DateValueGenerator
   */
  protected formatValue(index: number): Date {
    const date = DateValueGenerator.INITIAL_VALUE;
    date.setDate(date.getDate() + index);
    return date;
  }
}