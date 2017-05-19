import { Assert, ClassMetadata, Dictionary, Funktion, IToString } from '@fluxgate/core';

import { ICrudServiceRequests } from '../../redux/service-requests/crud-service-requests.interface';
import { EnumTableOptions } from '../decorator/model/enumTableOptions';
import { TableOptions } from '../decorator/model/tableOptions.interface';
import { IEntity } from '../entity.interface';
import { ColumnMetadata } from '../metadata/columnMetadata';
import { EnumTableService } from '../service/enumTableService';
import { IReadonlyService } from '../service/readonly-service.interface';
import { SpecialColumns } from './specialColumns';

/**
 *  Modelliert Metadaten für Modellklasse/DB-Tabelle
 *
 * @export
 * @class TableMetadata
 */
export abstract class TableMetadata extends ClassMetadata {
  private _columnMetadata: ColumnMetadata[] = [];
  private propertyMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
  private dbColMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
  // private _primaryKeyColumn: ColumnMetadata;
  private _specialColMap: Dictionary<SpecialColumns, ColumnMetadata> = new Dictionary<SpecialColumns, ColumnMetadata>();



  /**
   * Creates an instance of TableMetadata.
   *
   * @param {Function} target - Modelklasse
   * @param {TableOptions} options - Tableoptions
   * @param {boolean} isEnumTable - falls true, virtuelle Tabelle mit Enum-Werten
   *
   * @memberOf TableMetadata
   */
  protected constructor(target: Funktion, public options: TableOptions | EnumTableOptions) {
    super(target, target.name);
  }

  /**
   * Fügt eine {ColumnMetadata} für eine DB-Spalte hinzu.
   *
   * @param {ColumnMetadata} metadata
   *
   * @memberOf TableMetadata
   */
  public add(metadata: ColumnMetadata) {
    this._columnMetadata.push(metadata);
    this.propertyMap.set(metadata.propertyName, metadata);
    this.dbColMap.set(metadata.options.name, metadata);

    if (metadata.options.primary) {
      this.setSpecialColumn(metadata.propertyName, SpecialColumns.PRIMARY_KEY);
    }
  }


  public setSpecialColumn(propertyName: string, key: SpecialColumns) {
    Assert.notNullOrEmpty(propertyName);
    Assert.that(!this._specialColMap.containsKey(key),
      `${key} darf nur einmal gesetzt sein: bereits gesetzt für ${propertyName}`);

    const metadata = this.getColumnMetadataByProperty(propertyName);
    this._specialColMap.set(key, metadata);
  }


  /**
   * Liefert alle {ColumnMetadata}-Infos.
   *
   * @readonly
   * @type {ColumnMetadata[]}
   * @memberOf TableMetadata
   */
  public get columnMetadata(): ColumnMetadata[] {
    return this._columnMetadata;
  }


  /**
   * Erzeugt eine neue Modellinstanz
   *
   * @template T
   * @returns
   *
   * @memberOf TableMetadata
   */
  public createEntity<T>() {
    return Reflect.construct(this.target as (() => void), []) as T;
  }

  /**
   * Erzeugt aus dem JSON-Object @param{json} eine Modelinstanz vom Typ @see{T}
   *
   * @template T
   * @param {Function} target
   * @param {*} json
   * @param {boolean} mapColumns - falls true, sind im Json-Objekt die Propertynamen die DB-Spaltennamen und
   *                                 müssen gemappt werden
   * @returns {T}
   *
   * @memberOf TableMetadata
   */
  public createModelInstance<T>(json: any, mapColumns = true): T {
    const instance = this.createEntity();

    // alle Properties der Row über Reflection ermitteln
    const props = Reflect.ownKeys(json);

    // ... und dann die Werte der Zielentity zuweisen
    for (const propName of props) {
      let colMetadata = null;

      if (mapColumns) {
        colMetadata = this.getColumnMetadataByDbCol(propName.toString());
      } else {
        colMetadata = this.getColumnMetadataByProperty(propName.toString());
      }
      Assert.notNull(colMetadata);

      if (colMetadata.options.persisted) {
        instance[colMetadata.propertyName] = colMetadata.convertToProperty(json[propName]);
      }
    }

    return instance as T;
  }


  /**
   * Erzeugt aus der Modelinstanz vom Typ @see{T} ein JSON-Object @param{json} mit den zugehörigen Spaltennamen.
   *
   * @template T
   * @param {T} subject
   * @returns {*}
   *
   * @memberOf TableMetadata
   */
  public createDatabaseInstance<T>(entity: T): any {
    const dbInstance = {};

    for (const col of this.columnMetadata) {
      if (col.options.persisted) {
        dbInstance[col.options.name] = col.convertFromProperty(entity[col.propertyName]);
      }
    }

    return dbInstance;
  }


  /**
   * Liefert eine {ColumnMetadata} oder null für die Property @param{propertyName}
   *
   * @param {string} propertyName
   * @returns
   *
   * @memberOf TableMetadata
   */
  public getColumnMetadataByProperty(propertyName: string) {
    return this.propertyMap.get(propertyName);
  }

  /**
   * Liefert eine {ColumnMetadata} oder null für den DB-Spaltennamen @param{dbColName}.
   *
   * @param {string} dbColName
   * @returns
   *
   * @memberOf TableMetadata
   */
  public getColumnMetadataByDbCol(dbColName: string) {
    return this.dbColMap.get(dbColName);
  }

  /**
   * Liefert den DB-Spaltennamen für den Propertynamen @param{propertyName}
   */
  public getDbColumnName(propertyName: string) {
    Assert.notNullOrEmpty(propertyName);

    const colMetadata = this.propertyMap.get(propertyName);
    Assert.notNull(colMetadata, `Propertyname ${propertyName} nicht definiert.`);
    Assert.that(colMetadata.options.persisted, `Propertyname ${propertyName} muss Option persisted=true haben.`);

    return colMetadata.options.name;
  }

  /**
   * Liefert die Primary Key Column oder undefined
   */
  public get primaryKeyColumn(): ColumnMetadata {
    return this._specialColMap.get(SpecialColumns.PRIMARY_KEY);
  }

  /**
   * Liefert die Version Column oder undefined
   */
  public get versionColumn(): ColumnMetadata {
    return this._specialColMap.get(SpecialColumns.VERSION);
  }

  /**
   * Liefert die Client Column oder undefined
   */
  public get clientColumn(): ColumnMetadata {
    return this._specialColMap.get(SpecialColumns.CLIENT);
  }

  /**
   * Liefert die Test Column oder undefined
   */
  public get testColumn(): ColumnMetadata {
    return this._specialColMap.get(SpecialColumns.TEST);
  }



  /**
   * Liefert eine zugehörige Serviceinstanz.
   *
   * Wenn die Table keine EnumTable ist, wird die Serviceinstance über den @param{injector} ermittelt;
   * sonst wird ein entsprechender @see{EnumTableService} erzeugt.
   *
   * @param {*} injector
   * @returns {IServiceCrud}
   *
   * @memberOf TableMetadata
   */
  public getServiceInstance<T, TId>(injector: any): IReadonlyService<T, TId> {
    if (this.options instanceof EnumTableOptions) {
      return new EnumTableService(this, this.options.enumValues);
    } else {
      return injector.get(this.serviceClazz);
    }
  }

  public getServiceRequestsInstance<T extends IEntity<TId>, TId extends IToString>(injector: any):
    ICrudServiceRequests<T, TId> {
    return injector.get(this.serviceRequestsClazz);
  }


  /**
   * Liefert den Klassennamen des zugehörigen Modells (z.B. 'Artikel')
   */
  public get className(): string {
    return this.targetName;
  }

  /**
   * Liefert den Tabellennamen des zugehörigen Modells (z.B. 'artikel')
   */
  public get tableName(): string {
    return this.options.name;
  }

  public createPropertiesMap(): { [name: string]: string | any } {
    const map: { [name: string]: string | any } = {};
    this.columnMetadata.forEach((column) => map[column.propertyName] = column.propertyName);
    return map;
  }


  /**
   * Liefert die zugehörige Serviceklasse (oder undefined)
   */
  protected abstract get serviceClazz(): Funktion;

  /**
   * Registriert die zugehörigen Serviceklasse (Class/Constructor Function)
   */
  protected abstract registerServiceClazz(serviceClazz: Funktion);


  /**
   * Liefert die zugehörige ServiceRequests-Klasse (oder undefined)
   */
  protected abstract get serviceRequestsClazz(): Funktion;

  /**
   * Registriert die zugehörigen ServiceRequests-Klasse (Class/Constructor Function)
   */
  protected abstract registerServiceRequestsClazz(serviceRequestsClazz: Funktion);

}