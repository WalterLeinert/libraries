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

  constructor(private value: T) {
  }

  public next(): IteratorResult<T> {
    return {
      done: false,
      value: this.value
    };
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}