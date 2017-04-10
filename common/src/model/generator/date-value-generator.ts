import { ValueGenerator } from './value-generator';

export class DateValueGenerator extends ValueGenerator<Date> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): Date {
    return new Date();    // TODO
  }
}