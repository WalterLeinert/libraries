import { SequenceGeneratorStrategy } from './sequence-generator-strategy';
import { ValueGenerator } from './value-generator';

export class StringIdGenerator extends ValueGenerator<string> {
  constructor(count: number) {
    super(new SequenceGeneratorStrategy(count, 1, 1));
  }

  protected formatValue(index: number): string {
    return `id-${index}`;
  }
}