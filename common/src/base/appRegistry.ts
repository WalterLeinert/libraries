import { Assert } from '../util/assert';
import { Dictionary } from './../types/dictionary';

/**
 * Globale Registry für anwendungsweite Daten
 */
export class AppRegistry {
  private static _instance = new AppRegistry();

  private dataDict: Dictionary<string, any> = new Dictionary<string, any>();

  /**
   * fügt unter dem Key @param{key} eine neue Dateninstanz @param{data} hinzu.
   *
   * @param {string} key
   * @param {T} data
   *
   * @memberOf AppRegistry
   */
  public add<T>(key: string, data: T, replace = false) {
    Assert.notNullOrEmpty(key);
    Assert.notNull(data);

    if (!replace) {
      Assert.that(!this.exists(key), `Für Key ${key} ist bereits eine Dateninstanz registriert.`);
    }

    this.dataDict[key] = data;
  }


  /**
   * liefert für den Key @param{key} die entsprechende Dateninstanz.
   *
   * @param {string} key
   * @returns {T} Dateninstanz
   *
   * @memberOf AppRegistry
   */
  public get<T>(key: string): T {
    Assert.notNullOrEmpty(key);
    return this.dataDict[key];
  }

  /**
   * entfernt für den Key @param{key} die entsprechende Dateninstanz.
   *
   * @param {string} key
   *
   * @memberOf AppRegistry
   */
  public remove<T>(key: string) {
    Assert.notNullOrEmpty(key);
    this.dataDict[key] = undefined;
  }

  /**
   * liefert true, falls unter dem Key @param{key} eine Dateninstanz registriert ist.
   *
   * @param {string} key
   * @returns {T} Dateninstanz
   *
   * @memberOf AppRegistry
   */
  public exists(key: string): boolean {
    Assert.notNullOrEmpty(key);
    return (key in this.dataDict);
  }

  /**
   * Liefert die Singleton-Instanz.
   *
   * @readonly
   * @static
   * @type {AppRegistry}
   * @memberOf AppRegistry
   */
  public static get instance(): AppRegistry {
    return AppRegistry._instance;
  }
}