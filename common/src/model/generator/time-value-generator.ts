import { Time } from '../../types/time';
import { ValueGenerator } from './value-generator';

export class TimeValueGenerator extends ValueGenerator<Time> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): Time {
    return new Time(10, 30, 15);    // TODO
  }
}