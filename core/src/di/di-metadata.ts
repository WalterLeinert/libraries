import { Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { IComponentOptions } from './component-options.interface';

export interface IGetter<TReturn, T> {
  get(t: T, optional?: any): TReturn;
}


export abstract class DiMetadata<T extends IGetter<any, TToken>, TToken> extends ClassMetadata {
  private _providers: Provider[] = [];
  private _injector: ReflectiveInjector;


  protected constructor(target: Funktion, providers: Provider[]) {
    super(target, target.name);

    if (providers) {
      this._providers = [...providers];
      // this._injector = ReflectiveInjector.resolveAndCreate(this._providers);
    }
  }


  public get providers(): Provider[] {
    return this._providers;
  }

  public createInjector(providers: Provider[]) {
    this._injector = this.onCreateInjector(providers);
  }

  public getInstance<TInstance>(token: Funktion | TToken | any, notFoundValue?: any): TInstance {
    return this.injector.get(token, notFoundValue) as TInstance;
  }

  protected abstract onCreateInjector(providers: Provider[]): ReflectiveInjector;

  protected get injector(): ReflectiveInjector {
    return this._injector;
  }
}