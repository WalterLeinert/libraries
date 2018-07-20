import { SequenceGeneratorStrategy } from './sequence-generator-strategy';
import { StringValueGenerator } from './string-value-generator';

export class StringIdGenerator extends StringValueGenerator {
  constructor(count: number, private prefix: string = 'id') {
    super(new SequenceGeneratorStrategy(count, 1, 1), prefix);
  }
}