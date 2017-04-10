import { ValueGenerator } from './value-generator';

export class StringValueGenerator extends ValueGenerator<string> {

  constructor(private template: string, strategy: Iterator<number>) {
    super(strategy);
  }


  protected formatValue(index: number): string {
    return `${this.template}-${index}`;
  }
}