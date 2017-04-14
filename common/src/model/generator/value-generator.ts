import { InvalidOperationException } from '@fluxgate/core';

import { IValueGenerator } from './value-generator.interface';

export abstract class ValueGenerator<T> implements IterableIterator<T>, IValueGenerator {
  private _current: IteratorResult<T>;

  constructor(private strategy: Iterator<number>) {
  }

  public next(): IteratorResult<T> {
    const result = this.strategy.next();

    if (result.done) {
      this._current = {
        done: true,
        value: undefined
      };
    } else {
      this._current = {
        done: false,
        value: this.formatValue(result.value)
      };
    }
    return this._current;
  }

  public current(): T {
    if (this._current.done) {
      throw new InvalidOperationException(`no current value: max iterations exceeded`);
    }
    return this._current.value;
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  protected abstract formatValue(index: number): T;
}