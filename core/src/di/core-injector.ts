import { Injectable, Injector, OpaqueToken } from 'injection-js';

import { Funktion } from '../base/objectType';
import { InjectorBase } from './injector-base';


/**
 * Hilfsklasse als Singleton für dependency injection über den Injector der Hauptkomponente/Anwendung; dort
 * muss der Injector mittels @see{setInjector} gesetzt werden.
 *
 * Instanzen können dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class CoreInjector
 */
@Injectable()
export class CoreInjector extends InjectorBase<Injector, OpaqueToken> {
  public static readonly instance = new CoreInjector();

  private constructor() {
    super();
    // ok
  }
}
