import { ValueGenerator } from './value-generator';

export class BooleanValueGenerator extends ValueGenerator<boolean> {

  constructor(strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): boolean {
    return (index % 2) === 0;
  }
}