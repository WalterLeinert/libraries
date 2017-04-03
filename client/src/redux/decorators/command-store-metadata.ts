import { Funktion } from '@fluxgate/common';

export class CommandStoreMetadata {

  constructor(public target: Funktion) {
  }

  public createStore<T>() {
    return Reflect.construct(this.target as (() => void), []) as T;
  }
}