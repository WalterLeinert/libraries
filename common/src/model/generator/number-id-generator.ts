import { NumberValueGenerator } from './number-value-generator';
import { SequenceGeneratorStrategy } from './sequence-generator-strategy';

export class NumberIdGenerator extends NumberValueGenerator {
  constructor(count: number) {
    super(new SequenceGeneratorStrategy(count, 1, 1));
  }
}