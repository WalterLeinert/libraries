// tslint:disable:no-bitwise

export enum EntityStatus {

  /**
   * kein Status
   */
  None = 0,

  /**
   * markiert die Entity als archiviert
   */
  Archived = 1 << 0,

  /**
   * markiert die Entity als deleted
   */
  Deleted = 1 << 1,
}



export class EntityStatusHelper {

  /**
   * Setzt das Flag @param{flag} im @param{bitfield} auf den Wert @param{value}.
   *
   * @static
   * @param {number} bitfield
   * @param {EntityStatus} flag
   * @param {boolean} value
   * @returns {number}
   *
   * @memberof EntityStatusHelper
   */
  public static setFlag(bitfield: number, flag: EntityStatus, value: boolean): number {
    if (value) {
      bitfield |= flag;
    } else {
      bitfield &= ~flag;
    }
    return bitfield;
  }

  /**
   * Liefert den Wert des Flag @param{flag} im @param{bitfield}.
   *
   * @static
   * @param {number} bitfield
   * @param {EntityStatus} flag
   * @returns {boolean}
   *
   * @memberof EntityStatusHelper
   */
  public static hasFlag(bitfield: number, flag: EntityStatus): boolean {
    return (bitfield & flag) === flag;
  }

}
