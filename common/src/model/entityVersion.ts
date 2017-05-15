import { Column } from '../model/decorator/model/column';
import { Table } from '../model/decorator/model/table';
import { Version } from '../model/decorator/model/version';
import { IEntity } from './entity.interface';
import { IVersionedEntity } from './versioned-entity.interface';

/**
 * Tracking der Versionsnummer der einzelenen Entity-Tabellen
 */
@Table({ name: EntityVersion.TABLE_NAME })
export class EntityVersion implements IEntity<string>, IVersionedEntity {
  public static readonly TABLE_NAME = 'entityversion';

  @Column({ name: 'entityversion_id', primary: true, displayName: 'EntityVersionId' })
  public id: string;

  @Version()
  @Column({ name: 'entityversion_version', displayName: 'Version' })
  public __version: number;
}