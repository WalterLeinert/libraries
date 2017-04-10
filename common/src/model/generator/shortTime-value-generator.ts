import { ShortTime } from '../../types/shortTime';
import { ValueGenerator } from './value-generator';

export class ShortTimeValueGenerator extends ValueGenerator<ShortTime> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): ShortTime {
    return new ShortTime(20, 15);    // TODO
  }
}