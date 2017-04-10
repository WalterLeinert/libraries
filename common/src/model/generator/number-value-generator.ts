import { ValueGenerator } from './value-generator';

export class NumberValueGenerator extends ValueGenerator<number> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): number {
    return index;
  }
}