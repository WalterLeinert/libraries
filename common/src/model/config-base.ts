import { StringBuilder } from '@fluxgate/core';

import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';
import { FlxEntity } from './flx-entity';


/**
 * Abstrakte Basisklasse für alle Systemkonfigurations-Klassen, die über die Entity SystemConfig
 * und deren Property json gepflegt werden.
 * Die Id einer Entity @see{SystemConfig} besteht aus ConfigBase.Type '-' ConfigBase.Id.
 *
 * @export
 * @abstract
 * @class ConfigBase
 * @extends {FlxEntity<string>}
 */
@Table()
export abstract class ConfigBase extends FlxEntity<string> {
  /**
   * Default-Id für die Konfiguration
   */
  public static readonly DEFAULT_ID = 'default';

  /**
   * Name der Typ-Spalte
   */
  public static readonly TYPE_COLUMN = 'type';


  /**
   * Die Id der Konfiguration. Es kann mehrere Konfigurationen des Typs @see{type} geben
   *
   * @type {string}@memberof ConfigBase
   */
  @IdColumn({ displayName: 'Id' })
  public id: string = ConfigBase.DEFAULT_ID;


  /**
   * Typ der Konfiguration (z.B. 'smtp')
   *
   * @type {string}@memberof ConfigBase
   */
  @Column({ hidden: true })
  public type: string;


  /**
   * Die Beschreibung der Konfiguration.
   *
   * @type {string}@memberof ConfigBase
   */
  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Description' })
  public description: string;


  /**
   * Die Version des Konfigurationsschemas.
   * Damit lässt sich Kompatibilität prüfen bzw. automatische
   * Konvertierung durchführen.
   *
   * @type {number}@memberof ConfigBase
   */
  @Column({ displayName: 'Version', nullable: true })
  public version?: number = 1;


  @Column({ displayName: 'Name', persisted: false })
  public get name(): string {
    return ConfigBase.createId(this.type, this.id);
  }

  public static createId(type: string, id: string): string {
    return `${type}-${id}`;
  }
}