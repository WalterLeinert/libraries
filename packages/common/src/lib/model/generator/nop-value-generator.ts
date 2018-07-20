import { IValueGenerator } from './value-generator.interface';

/**
 * Nop-Valuegenerator: weist der Property keine Wert zu.
 *
 * @export
 * @class NopValueGenerator
 * @implements {IterableIterator<T>}
 * @implements {IValueGenerator}
 * @template T
 */
export class NopValueGenerator<T> implements IterableIterator<T>, IValueGenerator {
  private _current: IteratorResult<T>;

  public next(): IteratorResult<T> {
    this._current = {
      done: false,
      value: undefined
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