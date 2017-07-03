import { Funktion } from '../base/objectType';

export interface IGetter<TReturn, T> {
  get(t: T): TReturn;
}


/**
 * generische Hilfsklasse als Singleton für dependency injection über den Injector der Hauptkomponente/Anwendung; dort
 * muss der Injector mittels @see{setInjector} gesetzt werden.
 *
 * Instanzen können dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class InjectorBase
 */
export abstract class InjectorBase<T extends IGetter<any, TToken>, TToken> {
  private injector: T;

  /**
   * Setzt den globalen Injector.
   *
   * @param {Injector} injector
   *
   * @memberOf AppInjector
   */
  public setInjector(injector: T) {
    this.injector = injector;
  }

  public getInjector(): T {
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
  public getInstance<T>(token: Funktion | TToken | any): T {
    return this.injector.get(token) as T;
  }
}
