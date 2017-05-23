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

  public peek(): T {
    if (this._store.length <= 0) {
      throw new InvalidOperationException(`top called on empty stack`);
    }
    return this._store[this._store.length - 1];
  }

  public isEmpty(): boolean {
    return this._store.length <= 0;
  }
}