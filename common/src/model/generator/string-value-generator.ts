import { ValueGenerator } from './value-generator';

export class StringValueGenerator extends ValueGenerator<string> {

  constructor(strategy: Iterator<number>, private template: string) {
    super(strategy);
  }


  protected formatValue(index: number): string {
    return `${this.template}-${index + 1}`;
  }
}