import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { StatusColumn } from '../model/decorator/status-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';
import { EntityStatus, EntityStatusHelper } from './entity-status';
import { FlxEntity } from './flx-entity';
import { IStatusEntity } from './status-entity.interface';


/**
 * Abstrakte Basisklasse für alle Systemkonfigurations-Klassen, die über die Entity SystemConfig
 * und deren Property json gepflegt werden
 *
 * @export
 * @abstract
 * @class ConfigBase
 * @extends {FlxEntity<string>}
 */
@Table()
export abstract class ConfigBase extends FlxEntity<string> {

  @IdColumn({ displayName: 'Id' })
  public id: string;

  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Description' })
  public description: string;

  @Column({ displayName: 'Version', nullable: true })
  public version?: number;
}