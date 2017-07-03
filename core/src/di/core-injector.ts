import { Injectable, Injector, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Types } from '../types/types';
import { InjectorBase } from './injector-base';


/**
 * Hilfsklasse als Singleton mit root injector für dependency injection.
 *
 * Erst nach mindestens einem Aufruf von resolveAndCreate können Instanzen
 * dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class CoreInjector
 */
@Injectable()
export class CoreInjector extends InjectorBase<ReflectiveInjector, OpaqueToken> {
  public static readonly instance = new CoreInjector();

  private constructor() {
    super();
    // ok
  }


  protected onResolveAndCreate(providers: Provider[], injector?: ReflectiveInjector): ReflectiveInjector {
    if (!Types.isPresent(injector)) {
      injector = ReflectiveInjector.resolveAndCreate(providers);
      this.clearInjector();

      // console.warn(`cleared existing injector`);
      this.setInjector(injector);
    } else {
      injector = (injector as ReflectiveInjector).resolveAndCreateChild(providers);
    }

    return injector as ReflectiveInjector;
  }
}