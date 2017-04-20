/**
 * Interface für Versionierung der Entities (für optimistic lock detection)
 *
 * @export
 * @interface IVersionedEntity
 * @extends {IEntity<TId>}
 * @template TId
 */
export interface IVersionedEntity {
  __version: number;
}