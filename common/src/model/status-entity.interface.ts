/**
 * Interface für Entities mit einem Status als bitfield
 *
 * @export
 * @interface IStatusEntity
 */
export interface IStatusEntity {


  /**
   * Bitfield mit Statusinformation.
   *
   * @type {number}
   * @memberof IStatusEntity
   */
  __status: number;


  __deleted: boolean;
  __archived: boolean;
}