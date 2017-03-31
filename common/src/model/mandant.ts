import { Column } from '../model/decorator/model/column';
import { Table } from '../model/decorator/model/table';
import { Validation } from '../model/decorator/model/validation';
import { Validators } from '../model/validation/validators';


/**
 * Modelliert Mandanten
 */
@Table({ name: Mandant.TABLE_NAME })
export class Mandant {
  public static readonly TABLE_NAME = 'mandant';
  public static readonly FIRST_ID = 1;

  @Column({ name: 'mandant_id', primary: true, generated: true, displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'mandant_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'mandant_description', displayName: 'Description' })
  public description: string;

}