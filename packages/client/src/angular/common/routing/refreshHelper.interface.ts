
/**
 * Interface für die Durchführung von Refresh-Aktionen auf Model-Listen
 *
 * @export
 * @interface IRefreshHelper
 * @template T
 */
export interface IRefreshHelper<T> {
  /**
   * Liste von Model-Items
   *
   * @type {T[]}
   * @memberOf IRefreshHelper
   */
  items: T[];

  /**
   * zu selektierendes Item (oder undefined)
   *
   * @type {T}
   * @memberOf IRefreshHelper
   */
  selectedItem: T;
}