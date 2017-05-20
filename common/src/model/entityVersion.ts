import { Column } from '../model/decorator/column';
import { Table } from '../model/decorator/table';
import { VersionColumn } from '../model/decorator/version-column';
import { IFlxEntity } from './flx-entity.interface';
import { IVersionedEntity } from './versioned-entity.interface';

/**
 * Tracking der Versionsnummer der einzelenen Entity-Tabellen
 */
@Table({ name: EntityVersion.TABLE_NAME })
export class EntityVersion implements IFlxEntity<string>, IVersionedEntity {
  public static readonly TABLE_NAME = 'entityversion';

  @Column({ name: 'entityversion_id', primary: true, displayName: 'EntityVersionId' })
  public id: string;

  @VersionColumn({ name: 'entityversion_version', displayName: 'Version' })
  public __version: number;
}