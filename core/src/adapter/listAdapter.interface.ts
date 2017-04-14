import { Observable } from 'rxjs/Observable';

/**
 * Interface für Adapter zum Bereitstellen von Listen des Typs {T}
 */
export interface IListAdapter<T> {

  /**
   * Liefert ein Array von Items vom Typ @type{T} als @see{Observable}
   *
   * @returns{Observable<T[]>}
   */
  getItems(): Observable<T[]>;
}