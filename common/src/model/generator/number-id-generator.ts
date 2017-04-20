import { SequenceGeneratorStrategy } from './sequence-generator-strategy';
import { ValueGenerator } from './value-generator';

export class NumberIdGenerator extends ValueGenerator<number> {
  constructor(count: number) {
    super(new SequenceGeneratorStrategy(count, 1, 1));
  }

  protected formatValue(index: number): number {
    return index;
  }
}