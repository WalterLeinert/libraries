import { Column } from '../model/decorator/column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { VersionColumn } from '../model/decorator/version-column';
import { Validators } from '../model/validation/validators';
import { IFlxEntity } from './flx-entity.interface';


/**
 * Modelliert Mandanten
 */
@Table({ name: Client.TABLE_NAME })
export class Client implements IFlxEntity<number> {
  public static readonly TABLE_NAME = 'client';
  public static readonly FIRST_ID = 1;

  @Column({ name: 'client_id', primary: true, generated: true, displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'client_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'client_description', displayName: 'Description' })
  public description: string;

  @VersionColumn({ name: 'client_version', displayName: 'Version', default: 0 })
  public __version: number;

}