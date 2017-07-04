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
   * Der erste Aufruf erzeugt einen Injector, der in der Singleton-Instanz als Root-Injector gehalten wird.
   *
   * Bei weiteren Aufrufen wird entweder der Root-Injector vewendet oder @param{parent},
   * falls dieser angegeben wurde.
   *
   * @protected
   * @param {any[]} providers
   * @param {T} [parent]
   * @returns {T}
   * @memberof InjectorBase
   */
  public resolveAndCreate(providers: any[], parent?: T): T {
    const injector = parent ? parent : this.getInjector();
    return this.onResolveAndCreate(providers, parent /*TODO: injector*/);
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

  public setInjectorForTest(injector: T) {
    this.clearInjector();
    this.injector = injector;
  }

  /**
   * Setzt den globalen Injector.
   *
   * @param {Injector} injector
   *
   * @memberOf AppInjector
   */
  protected setInjector(injector: T) {
    if (this.injector) {
      throw new Error(`injector already set`);
    }
    this.injector = injector;
  }

  protected clearInjector() {
    this.injector = undefined;
  }



  protected abstract onResolveAndCreate(providers: any[], parent?: T): T;
}