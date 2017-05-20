import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { VersionColumn } from '../model/decorator/version-column';
import { IFlxEntity } from './flx-entity.interface';
import { IVersionedEntity } from './versioned-entity.interface';

/**
 * Tracking der Nummer der letzten Änderung auf einer Entity -> EntityVersionProxy, Optimierungen
 */
@Table({ name: EntityVersion.TABLE_NAME })
export class EntityVersion implements IFlxEntity<string>, IVersionedEntity {
  public static readonly TABLE_NAME = 'entityversion';

  @IdColumn({ name: 'entityversion_id', displayName: 'EntityVersionId' })
  public id: string;

  @VersionColumn({ name: 'entityversion_version', displayName: 'Version' })
  public __version: number;
}