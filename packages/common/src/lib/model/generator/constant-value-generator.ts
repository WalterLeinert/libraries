import { IValueGenerator } from './value-generator.interface';

/**
 * Valuegenerator für konstante Werte: liefert bei jeder Iteration denselben Wert.
 *
 * @export
 * @class ConstantValueGenerator
 * @implements {IterableIterator<T>}
 * @implements {IValueGenerator}
 * @template T
 */
export class ConstantValueGenerator<T> implements IterableIterator<T>, IValueGenerator {
  private _current: IteratorResult<T>;

  constructor(private value: T) {
  }

  public next(): IteratorResult<T> {
    this._current = {
      done: false,
      value: this.value
    };
    return this._current;
  }

  public current(): T {
    return this._current.value;
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}