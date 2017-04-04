import { Funktion } from '../../base/objectType';

export class CommandStoreMetadata {

  constructor(public target: Funktion) {
  }

  public createStore<T>() {
    return Reflect.construct(this.target as (() => void), []) as T;
  }
}