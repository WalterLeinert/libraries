import { Provider } from 'injection-js';


/**
 * Optionen für Komponente
 *
 * @export
 * @interface IComponentOptions
 */
export interface IComponentOptions {

  /**
   * Liste aller Provider
   *
   * @type {Provider[]}
   * @memberof IModuleOptions
   */
  providers?: Provider[];
}