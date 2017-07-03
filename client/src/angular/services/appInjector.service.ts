import { ReflectiveInjector } from 'injection-js';
import 'reflect-metadata';


import { Injectable, Injector, OpaqueToken } from '@angular/core';

import { CoreInjector, DEFAULT_CATEGORY, Funktion, InjectorBase, LOGGER, UniqueIdentifiable } from '@fluxgate/core';
import { getLogger } from '@fluxgate/platform';


/**
 * einen Defaultlogger ermitteln und für DI registrieren
 */
const defaulLogger = getLogger('default-logger');

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: DEFAULT_CATEGORY, useValue: defaulLogger.category },
  { provide: LOGGER, useValue: defaulLogger }
]);

CoreInjector.instance.setInjector(injector);


/**
 * Hilfsklasse als Singleton für dependency injection über den Injector der AppComponent; in AppComponent
 * muss der Injector mittels @see{setInjector} gesetzt werden.
 *
 * Instanzen können dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class AppInjector
 */
@Injectable()
export class AppInjector extends InjectorBase<Injector, OpaqueToken> {
  public static readonly instance = new AppInjector();

  private constructor() {
    super();
    // ok
  }
}