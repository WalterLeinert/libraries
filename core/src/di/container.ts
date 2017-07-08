import { Injectable, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { IGetter, InjectorBase } from './injector-base';


export class Container {
  private _injector: ReflectiveInjector;
  private _parent: Container;
  private _childContainers: Container[] = [];

  public constructor(
    childContainers?: Container[]) {
    if (childContainers) {
      childContainers.forEach((item) => {
        this.addChildContainer(item);
      });
    }

  }

  public addChildContainer(container: Container) {
    this._childContainers.push(container);
    container._parent = this;
  }

  public resolveAndCreate(providers: any[], parent?: ReflectiveInjector): ReflectiveInjector {
    let injector;
    if (!this._injector) {
      this._injector = ReflectiveInjector.resolveAndCreate(providers);    // Root-Injector
      injector = this._injector;
    } else {
      injector = this._injector.resolveAndCreateChild(providers);
    }
    return injector;
  }


  public getInstance<TInstance>(token: Funktion | OpaqueToken | any, notFoundValue?: any): TInstance {
    let instance: TInstance;

    if (this._injector) {
      instance = this._injector.get(token, notFoundValue) as TInstance;

    } else if (this._parent) {
      instance = this._parent.getInstance(token, notFoundValue) as TInstance;
    } else {
      throw new InvalidOperationException(`no provider for token: ${token}`);
    }
    return instance;
  }

}