import { Provider } from 'injection-js';

import { Funktion } from '../base/objectType';


/**
 * Optionen für Modul
 *
 * @export
 * @interface IModuleOptions
 */
export interface IModuleOptions {

  /**
   * Liste aller Modulimports
   *
   * @type {Funktion[]}
   * @memberof IModuleOptions
   */
  imports?: Funktion[];

  /**
   * Liste aller Komponentendeklarationen
   *
   * @type {Funktion[]}
   * @memberof IModuleOptions
   */
  declarations?: Funktion[] | any[];

  /**
   * Liste aller Komponentenexports
   *
   * @type {Funktion[]}
   * @memberof IModuleOptions
   */
  exports?: Funktion[] | any[];

  /**
   * Liste aller Provider
   *
   * @type {Provider[]}
   * @memberof IModuleOptions
   */
  providers?: Provider[];

  /**
   * Komponentenklassen für Bootstrap
   *
   * @type {Funktion}
   * @memberof IModuleOptions
   */
  bootstrap?: Funktion[];
}