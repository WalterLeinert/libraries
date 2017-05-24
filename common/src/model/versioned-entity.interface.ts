/**
 * Interface für Versionierung der Entities (für optimistic lock detection)
 *
 * @export
 * @interface IVersionedEntity
 */
export interface IVersionedEntity {

  /**
   * interne Versionsnummer der Änderungen
   *
   * @type {number}
   * @memberof IVersionedEntity
   */
  __version: number;
}