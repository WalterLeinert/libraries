import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';
import { VersionedEntity } from './versioned-entity';

/**
 * Modelliert Mandanten
 */
@Table({ name: Client.TABLE_NAME })
export class Client extends VersionedEntity<number> {
  public static readonly TABLE_NAME = 'client';
  public static readonly FIRST_ID = 1;

  @IdColumn({ name: 'client_id', displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'client_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'client_description', displayName: 'Description' })
  public description: string;

}