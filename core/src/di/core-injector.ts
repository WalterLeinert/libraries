import { Injectable, Injector, OpaqueToken } from 'injection-js';

import { Funktion } from '../base/objectType';

/**
 * Hilfsklasse als Singleton für dependency injection über den Injector der Hauptkomponente/Anwendung; dort
 * muss der Injector mittels @see{setInjector} gesetzt werden.
 *
 * Instanzen können dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class CoreInjector
 * @extends {UniqueIdentifiable}
 */
@Injectable()
export class CoreInjector {
  public static readonly instance = new CoreInjector();
  private injector: Injector;

  private constructor() {
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
