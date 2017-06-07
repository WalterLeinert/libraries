import { EnumHelper, Funktion } from '@fluxgate/core';

import { AppRegistry } from '../base/appRegistry';
import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { FlxEntity } from '../model/flx-entity';
import { Validators } from '../model/validation/validators';

// import { Mandant } from './mandant';
import { ISystemConfig } from './systemconfig.interface';


/**
 * Modelliert Systemconfig (Defaultimplemetierung)
 */
@Table({ name: SystemConfig.TABLE_NAME })
export class SystemConfig extends FlxEntity<string> implements ISystemConfig {
  public static readonly TABLE_NAME = 'systemconfig';


  @IdColumn({ name: 'systemconfig_id', displayName: 'Id' })
  public id: string;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'systemconfig_description', displayName: 'Description' })
  public description: string;

  @Column({ name: 'systemconfig_json', displayName: 'JSON' })
  public json: string;

}