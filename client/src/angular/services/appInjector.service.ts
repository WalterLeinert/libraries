import { Injectable, Injector, OpaqueToken, Provider, ReflectiveInjector } from '@angular/core';

import { InjectorBase } from '@fluxgate/core';


/**
 * Hilfsklasse als Singleton mit root injector für dependency injection.
 *
 * Erst nach mindestens einem Aufruf von resolveAndCreate können Instanzen
 * dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class AppInjector
 */
@Injectable()
export class AppInjector extends InjectorBase<ReflectiveInjector, OpaqueToken> {
  public static readonly instance = new AppInjector();

  private constructor() {
    super();
    // ok
  }


  public setInjector(injector: Injector) {
    super.setInjectorInternal(injector as ReflectiveInjector);
  }


  protected onResolveAndCreate(providers: Provider[], injector?: ReflectiveInjector): ReflectiveInjector {
    if (!injector) {
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