import { Assert } from '@fluxgate/core';

import { Column } from '../model/decorator/column';
import { ColumnGroup } from '../model/decorator/column-group';
import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';
import { FlxEntity } from './flx-entity';


/**
 * modelliert eine zusammengesetzte Id
 *
 * @export
 * @interface ICompositeId
 */
export interface ICompositeId {
  type: string;
  id: string;
}

/**
 * modelliert eine erweiterte zusammengesetzte Id, die zusätzlich Den Typ der Modelklasse enthält
 *
 * @export
 * @interface IFullId
 */
export interface IFullId {
  model: string;
  id: ICompositeId;
}


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
@ColumnGroup('standard', [
  'id',
  'configId',
  'description',
  'version'
], { displayName: 'Standard' })
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
   * Liefert die zusammengesetzte Id (type, id)
   *
   * @readonly
   * @type {string}
   * @memberof ConfigBase
   */
  @Column({ displayName: 'Id', persisted: false })
  public get id(): string {
    return ConfigBase.createId(this.type, this.configId);
  }


  /**
   * Die Id der Konfiguration. Es kann mehrere Konfigurationen des Typs @see{type} geben
   *
   * @type {string}
   * @memberof ConfigBase
   */
  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Config-Id' })
  public configId: string;  // = ConfigBase.DEFAULT_ID;


  /**
   * Typ der Konfiguration (z.B. 'smtp')
   *
   * @type {string}
   * @memberof ConfigBase
   */
  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Type', hidden: true })
  public type: string;


  /**
   * Die Beschreibung der Konfiguration.
   *
   * @type {string}
   * @memberof ConfigBase
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
   * @type {number}
   * @memberof ConfigBase
   */
  @Column({ displayName: 'Version', nullable: true })
  public version?: number = 1;


  /**
   * Liefert eine Id, die aus composite id und Typname der Modelklasse besteht.
   *
   * Beispiel: 'smpt-default@SmtConfig'
   *
   * @readonly
   * @type {string}
   * @memberof ConfigBase
   */
  public get fullId(): string {
    return `${this.id}@${this.constructor.name}`;
  }


  /**
   * Erzeugt aus @param{type} und @param{id} eine zusammengesetzte Id.
   *
   * @param type
   * @param id
   * @returns {string}
   */
  public static createId(type: string, id: string): string {
    Assert.notNullOrEmpty(type);
    // Assert.notNullOrEmpty(id); darf fehlen
    return `${type}-${id}`;
  }

  public static createFromCompositeId(compositeId: ICompositeId): string {
    Assert.notNull(compositeId);
    return `${compositeId.type}-${compositeId.id}`;
  }

  /**
   * Erzeugt aus der zusammengesetzten @param{compositeId} ein Tupel mit den Einzel-Ids (type, id).
   *
   * @param compositeId
   * @returns {ICompositeId}
   */
  public static parseId(compositeId: string): ICompositeId {
    Assert.notNullOrEmpty(compositeId);
    const parts = compositeId.split('-');
    Assert.that(parts.length === 2);
    return {
      type: parts[0],
      id: parts[1]
    };
  }

  /**
   * Erzeugt aus der @param{fullId} eine Instanz von @see{IFullId} mit der entsprechenden
   * Id-Information
   *
   * @param fullId
   * @returns {IFullId}
   */
  public static parseFullId(fullId: string): IFullId {
    Assert.notNullOrEmpty(fullId);
    const fullParts = fullId.split('@');
    Assert.that(fullParts.length === 2);

    return {
      model: fullParts[1],
      id: ConfigBase.parseId(fullParts[0])
    };
  }


  /**
   * Liefert true, falls die @param{id} eine zusammengesetzte Id ist.
   *
   * @static
   * @param {string} id
   * @returns {boolean}
   * @memberof ConfigBase
   */
  public static isCompositeId(id: string): boolean {
    Assert.notNullOrEmpty(id);
    return id.indexOf('-') >= 0;
  }

}