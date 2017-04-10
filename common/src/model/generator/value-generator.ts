import { IValueGenerator } from './value-generator.interface';

export abstract class ValueGenerator<T> implements IterableIterator<T>, IValueGenerator {

  constructor(private strategy: Iterator<number>) {
  }

  public next(): IteratorResult<T> {
    const result = this.strategy.next();

    if (result.done) {
      return {
        done: true,
        value: undefined
      };
    } else {
      return {
        done: false,
        value: this.formatValue(result.value)
      };
    }
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  protected abstract formatValue(index: number): T;
}