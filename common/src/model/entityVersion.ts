import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { VersionedEntity } from './versioned-entity';

/**
 * Tracking der Nummer der letzten Änderung auf einer Entity -> EntityVersionProxy, Optimierungen
 */
@Table({ name: EntityVersion.TABLE_NAME })
export class EntityVersion extends VersionedEntity<string> {
  public static readonly TABLE_NAME = 'entityversion';

  @IdColumn({ name: 'entityversion_id', displayName: 'EntityVersionId' })
  public id: string;

}