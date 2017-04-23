import { Assert, Funktion } from '@fluxgate/core';

import { RelationTypeInFunction } from '../../model/metadata/enumMetadata';
import { CommandStore } from '../command-store';

export class CommandStoreMetadata {

  constructor(public target: Funktion, private _parent?: RelationTypeInFunction) {
  }

  public get parent(): Funktion {
    Assert.that(!this._parent || (this._parent && (this._parent instanceof Function)));
    if (this._parent) {
      return (this._parent as () => any)();
    }
    return undefined;
  }

  public createStore<T>(parent?: CommandStore<any>) {
    return Reflect.construct(this.target as (() => void), [parent]) as T;
  }
}