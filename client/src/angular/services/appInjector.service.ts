import { Injectable, Injector, OpaqueToken } from '@angular/core';

import { Funktion, InvalidOperationException, Types, UniqueIdentifiable } from '@fluxgate/common';


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
  private static readonly _instance = new AppInjector();
  private static instanceId: number;
  private injector: Injector;

  private constructor() {
    super();

    if (!Types.isPresent(AppInjector.instanceId)) {
      AppInjector.instanceId = this.instanceId;
    } else {
      throw new InvalidOperationException(`Instance already exists.`);
    }
  }

  /**
   * Liefert die Singleton-Instanz.
   */
  public static get instance(): AppInjector {
    return AppInjector._instance;
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
  public getInstance<T>(token: Funktion | OpaqueToken): T {
    return this.injector.get(token) as T;
  }

}