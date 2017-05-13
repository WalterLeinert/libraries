import { SequenceGeneratorStrategy } from './sequence-generator-strategy';
import { StringValueListGenerator } from './string-value-list-generator';

export class StringIdListGenerator extends StringValueListGenerator {
  constructor(values: string[]) {
    super(values, new SequenceGeneratorStrategy(values.length, 0, 1));
  }
}