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
export class SystemConfig extends FlxEntity<number> implements ISystemConfig {
  public static readonly TABLE_NAME = 'systemconfig';

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly SYSTEMCONFIG_CONFIG_KEY = 'ISystemConfig';

  private static systemconfigIdMap: { [id: number]: boolean } = {};


  @IdColumn({ name: 'systemconfig_id', displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'systemconfig_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'systemconfig_json', displayName: 'JSON' })
  public json: string;


  /**
   * prüft, ob @param{id} eine gültige SystemConfig-Id darstellt.
   */
  public static isValidSystemConfig(id: number) {
    if (!id) {
      return false;
    }
    return (id in SystemConfig.systemconfigIdMap);
  }

}

/**
 * SystemConfig Klasse registrieren
 */
AppRegistry.instance.add<Funktion>(SystemConfig.SYSTEMCONFIG_CONFIG_KEY, SystemConfig);