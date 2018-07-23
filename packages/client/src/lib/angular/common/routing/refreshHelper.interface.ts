
/**
 * Interface für die Durchführung von Refresh-Aktionen auf Model-Listen
 */
export interface IRefreshHelper<T> {
  /**
   * Liste von Model-Items
   */
  items: T[];

  /**
   * zu selektierendes Item (oder undefined)
   */
  selectedItem: T;
}