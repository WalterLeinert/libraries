import { Funktion } from '../base/objectType';

export interface IGetter<TReturn, T> {
  get(t: T, optional?: any): TReturn;
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
    // TODO: const injector = parent ? parent : this.getInjector();
    return this.onResolveAndCreate(providers, parent /*TODO: injector*/);
  }


  public getInjector(): T {
    return this.injector;
  }

  /**
   * Liefert für das Token @param{token} eine entsprechende Instanz.
   *
   * @template TInstance
   * @param {(Funktion | OpaqueToken)} token
   * @param {any} notFoundValue
   * @returns {TInstance}
   *
   * @memberOf AppInjector
   */
  public getInstance<TInstance>(token: Funktion | TToken | any, notFoundValue?: any): TInstance {
    return this.injector.get(token, notFoundValue) as TInstance;
  }

  /**
   * Setzt einen neuen Injector.
   *
   * @param injector
   */
  protected setInjectorInternal(injector: T) {
    this.clearInjector();
    this.injector = injector;
  }

  /**
   * Setzt den globalen Injector und prüft, ob noch keiner registriert ist.
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