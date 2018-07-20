/**
 * Interface für Mandantenfähigkeit der Entities
 *
 * @export
 * @interface IClientEntity
 * @template TId
 */
export interface IClientEntity {


  /**
   * Id des Clients/Mandanten in der Entity @see{Client}
   *
   * @type {number}
   * @memberof IClientEntity
   */
  __client: number;
}