import { InvalidOperationException } from '../exceptions/invalidOperationException';

export class Stack<T> {
  private _store: T[] = [];

  public push(val: T) {
    this._store.push(val);
  }

  public pop(): T {
    if (this._store.length <= 0) {
      throw new InvalidOperationException(`pop called on empty stack`);
    }
    return this._store.pop();
  }
}