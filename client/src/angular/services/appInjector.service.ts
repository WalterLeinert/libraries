import { ReflectiveInjector } from 'injection-js';
import 'reflect-metadata';


import { Injectable, Injector, OpaqueToken } from '@angular/core';

import { CoreInjector, DEFAULT_CATEGORY, Funktion, LOGGER, UniqueIdentifiable } from '@fluxgate/core';
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
 * @extends {UniqueIdentifiable}
 */
@Injectable()
export class AppInjector extends UniqueIdentifiable {
  public static readonly instance = new AppInjector();
  private injector: Injector;

  private constructor() {
    super();
  }


  /**
   * Setzt den globalen Injector.
   *
   * @param {Injector} injector
   *
   * @memberOf AppInjector
   */
  public setInjector(injector: Injector) {
    this.injector = injector;
  }

  public getInjector(): Injector {
    return this.injector;
  }

  /**
   * Liefert für das Token @param{token} eine entsprechende Instanz.
   *
   * @template T
   * @param {(Funktion | OpaqueToken)} token
   * @returns {T}
   *
   * @memberOf AppInjector
   */
  public getInstance<T>(token: Funktion | OpaqueToken | any): T {
    return this.injector.get(token) as T;
  }

}