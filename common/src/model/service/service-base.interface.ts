import { IServiceCore } from './service-core.interface';

/**
 * Interface mit gemeinsamen Funktionen aller Services
 */
export interface IServiceBase<T, TId> extends IServiceCore {

  /**
   * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
   *
   * @type {string}
   */
  getModelClassName(): string;

  /**
   * Liefert den zugehörigen Tabellennnamen
   *
   * @type {string}
   */
  getTableName(): string;

  /**
   * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @param{any} item - eine Entity-Instanz
   * @type {any}
   */
  getEntityId(item: T): TId;

  /**
   * Setzt die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @param{any} item - eine Entity-Instanz
   * @param{any} id - eine Entity-Id
   * @type {any}
   */
  setEntityId(item: T, id: TId);
}
