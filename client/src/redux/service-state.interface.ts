/**
 * Interface für den Service-Status
 * 
 * @export
 * @interface IServiceState
 * @template T 
 * @template TId 
 */
export interface IServiceState<T, TId> {
  /**
   * aktuelles Item (z.B. nach Selektion im Grid)
   * 
   * @type {T}
   * @memberOf IServiceState
   */
  currentItem: T;

  /**
   * aktuelle Item-Liste (z.B. für Anzeige im Grid)
   * 
   * @type {T[]}
   * @memberOf IServiceState
   */
  items: T[];

  /**
   * aktuelles Item (z.B. nach create/update)
   * 
   * @type {T}
   * @memberOf IServiceState
   */
  item: T;

  /**
   * Id des gelöschten Items
   * 
   * @type {TId}
   * @memberOf IServiceState
   */
  deletedId: TId;
}