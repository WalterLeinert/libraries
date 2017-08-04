// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, ClassMetadata, Dictionary, Funktion, IToString, Tuple, Tuple3, Types } from '@fluxgate/core';

import { ICrudServiceRequests } from '../../redux/service-requests/crud-service-requests.interface';
import { EnumTableServiceRequests } from '../../redux/service-requests/enum-table-service-requests';
import { Store } from '../../redux/store/store';
import { EnumTableOptions } from '../decorator/enumTableOptions';
import { TableOptions } from '../decorator/tableOptions.interface';
import { EntityStatus, EntityStatusHelper } from '../entity-status';
import { IEntity } from '../entity.interface';
import { ColumnMetadata } from '../metadata/columnMetadata';
import { EnumTableService } from '../service/enumTableService';
import { IReadonlyService } from '../service/readonly-service.interface';
import { ColumnGroupMetadata } from './column-group-metadata';
import { MetadataStorage } from './metadataStorage';
import { SpecialColumns } from './specialColumns';


// Der Key für SpecialColumns ist ein Tupel aus (SpecialColumns, Propertyname)
export type SpecialColumnKey = Tuple<SpecialColumns, string>;

/**
 *  Modelliert Metadaten für Modellklasse/DB-Tabelle
 *
 * @export
 * @class TableMetadata
 */
export abstract class TableMetadata extends ClassMetadata {
  protected static readonly logger = getLogger(TableMetadata);


  private _columnMetadata: ColumnMetadata[] = [];
  private _columnGroupMetadata: ColumnGroupMetadata[] = [];

  private propertyMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
  private dbColMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
  // private _primaryKeyColumn: ColumnMetadata;
  private _specialColMap: Dictionary<SpecialColumnKey, ColumnMetadata> =
  new Dictionary<SpecialColumnKey, ColumnMetadata>();

  private _statusColMap: Dictionary<EntityStatus, ColumnMetadata> = new Dictionary<EntityStatus, ColumnMetadata>();



  /**
   * Creates an instance of TableMetadata.
   *
   * @param {Function} target - Modelklasse
   * @param {TableOptions} options - Tableoptions
   * @param {boolean} isEnumTable - falls true, virtuelle Tabelle mit Enum-Werten
   *
   * @memberOf TableMetadata
   */
  protected constructor(private _metadataStorage: MetadataStorage, target: Funktion,
    public options: TableOptions | EnumTableOptions) {
    super(target);
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
    this.addInternal(metadata);
  }


  /**
   * Fügt ein @see{ColumnGroupMetadata} hinzu.
   *
   * Dabei wird geprüft, ob geerbte column groups bzw. geerbte columns zu löschen sind.
   *
   * @param colGroupMetadata
   */
  public addGroupMetadata(colGroupMetadata: ColumnGroupMetadata) {
    using(new XLog(TableMetadata.logger, levels.DEBUG, 'createModelInstance'), (log) => {
      //
      // falls eine geerbte ColumnGroup gleichen Namens existiert, wird die geerbte
      // entfernt ("überschrieben")
      //
      const derivedIndex = this._columnGroupMetadata.findIndex((item) =>
        item.derived && item.name === colGroupMetadata.name);

      if (derivedIndex >= 0) {
        this._columnGroupMetadata.splice(derivedIndex, 1);
      }


      //
      // falls eine geerbte ColumnGroup Columns enthält, die der aktuellen ColumnGroup zugeordnet sind,
      // gleichen Namens existiert, werden die geerbten Columns gelöscht (und anschliessend durch
      // die neu zugeordneten ersetzt)
      // Gleichzeit werden alle columns, die column groups zugeordnet sind aus der default column group
      // entfernt
      //
      const columnNames = new Set(colGroupMetadata.columnNames);
      const cgmToDelete = new Set<ColumnGroupMetadata>();

      this._columnGroupMetadata.forEach((item) => {
        if (item.derived) {
          for (let i = item.columnNames.length - 1; i >= 0; i--) {
            if (columnNames.has(item.columnNames[i])) {
              item.columnNames.splice(i, 1);
              item.groupColumns.splice(i, 1);
            }
          }

        } else if (item.hidden) {
          // default column group
          for (let i = item.columnNames.length - 1; i >= 0; i--) {
            if (columnNames.has(item.columnNames[i])) {
              item.columnNames.splice(i, 1);
              item.groupColumns.splice(i, 1);
            }
          }
        }

        const allHidden = item.groupColumns.every((it) => it.options.hidden);

        //
        // wurden alle columns gelöscht oder sind alle columns als hidden markiert? -> column group löschen
        //
        if (item.columnNames.length <= 0 || allHidden) {
          cgmToDelete.add(item);
        }
      });

      //
      // falls mittlerweile eine geerbte column group leer geworden ist, wird diese entfernt
      //
      if (cgmToDelete.size > 0) {
        for (let i = this._columnGroupMetadata.length - 1; i >= 0; i--) {
          if (cgmToDelete.has(this._columnGroupMetadata[i])) {
            this._columnGroupMetadata.splice(i, 1);
          }
        }
      }


      //
      // schliesslich die neue column group direkt hinter die letzte geerbte column group einfügen ->
      // Reihenfolge:
      // - geerbte cgm
      // - 1. cgm
      // - 2. cgm
      // ...
      //
      const reversed = [...this._columnGroupMetadata].reverse();
      let lastDerivedIndex = reversed.findIndex((item) => item.derived);
      if (lastDerivedIndex < 0) {
        lastDerivedIndex = 0;
      } else {
        lastDerivedIndex = reversed.length - lastDerivedIndex - 1;
        lastDerivedIndex++;
      }

      // ... und neue Metadaten hinter diesem Einfügen
      this._columnGroupMetadata.splice(lastDerivedIndex, 0, colGroupMetadata);

      // column groups, die mittlerweile leer geworden sind entfernen
      for (let i = this._columnGroupMetadata.length - 1; i >= 0; i--) {
        if (this._columnGroupMetadata[i].columnNames.length <= 0) {
          if (!this._columnGroupMetadata[i].hidden) {
            log.warn(`column group ${this._columnGroupMetadata[i].name} has no columns`);
          }
          this._columnGroupMetadata.splice(i, 1);
        }
      }


      //
      // hidden column groups, die ausschliesslich geerbte columns haben, werden
      // an den Anfang verschoben
      //
      const cgmToMove = [];

      for (let i = this._columnGroupMetadata.length - 1; i >= 0; i--) {
        if (this._columnGroupMetadata[i].hidden) {
          const allDerived = this._columnGroupMetadata[i].groupColumns.every((item) => item.derived);
          if (allDerived) {
            cgmToMove.push(i);
          }
        }
      }

      let startIndex = 0;

      // wichtig: index läuft von oben nach unten wegen "remove"
      cgmToMove.forEach((item) => {
        const cgm = this._columnGroupMetadata.splice(item, 1);
        this._columnGroupMetadata.splice(startIndex, 0, ...cgm);
        startIndex++;
      });

    });
  }



  /**
   * Fügt die Metadaten @param{metadata} vor die bisherigen Metadaten ein.
   *
   * @param metadatas
   */
  public insert(metadatas: ColumnMetadata[]) {
    this._columnMetadata.unshift(...metadatas);
    metadatas.forEach((item) => this.addInternal(item));
  }


  public setSpecialColumn(propertyName: string, specialColumnKey: SpecialColumns) {
    Assert.notNullOrEmpty(propertyName);
    let key: SpecialColumnKey;

    if (specialColumnKey === SpecialColumns.SECRET) {
      key = new Tuple(specialColumnKey, propertyName);
    } else {
      key = new Tuple(specialColumnKey, '');
    }

    Assert.that(!this._specialColMap.containsKey(key),
      `${key} darf nur einmal gesetzt sein: bereits gesetzt für ${propertyName}`);

    const metadata = this.getColumnMetadataByProperty(propertyName);
    this._specialColMap.set(key, metadata);
  }

  public getSpecialColumn(key: SpecialColumns, propertyName: string = ''): ColumnMetadata {
    Assert.notNull(key);

    return this._specialColMap.get(new Tuple(key, propertyName));
  }



  public setStatusColumn(propertyName: string, status: EntityStatus) {
    Assert.notNullOrEmpty(propertyName);
    Assert.that(!this._statusColMap.containsKey(status),
      `${status} darf nur einmal gesetzt sein: bereits gesetzt für ${propertyName}`);

    const metadata = this.getColumnMetadataByProperty(propertyName);
    this._statusColMap.set(status, metadata);
  }

  public getStatusColumn(status: EntityStatus): ColumnMetadata {
    Assert.notNull(status);
    return this._statusColMap.get(status);
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

  public get columnGroupMetadata(): ColumnGroupMetadata[] {
    return this._columnGroupMetadata;
  }


  public createDefaultColumnGroup() {
    this._columnGroupMetadata.push(new ColumnGroupMetadata(
      ColumnGroupMetadata.DEFAULT_NAME, this._columnMetadata.map((item) => item.propertyName),
      { displayName: ColumnGroupMetadata.DEFAULT_NAME }, [...this._columnMetadata], true, false, this.isAbstract)
    );
  }


  public get specialColumnKeys(): SpecialColumnKey[] {
    return this._specialColMap.keys;
  }

  public get statusColumnKeys(): EntityStatus[] {
    return this._statusColMap.keys;
  }

  public get isAbstract(): boolean {
    let isAbstract = false;
    if (!(this.options instanceof EnumTableOptions)) {
      isAbstract = this.options.isAbstract;
    }
    return isAbstract;
  }

  /**
   * Erzeugt eine neue Modellinstanz
   *
   * @template T
   * @returns
   *
   * @memberOf TableMetadata
   */
  public createEntity<T>(): T {
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
    return using(new XLog(TableMetadata.logger, levels.DEBUG, 'createModelInstance'), (log) => {
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

        // if (!colMetadata) {
        //   log.warn(`todo: entity ${this.tableName} has no property ${propName.toString()}`);

        // } else {
        //   if (colMetadata.options.persisted) {
        //     instance[colMetadata.propertyName] = colMetadata.convertToProperty(json[propName]);
        //   }
        // }

      }

      return instance as T;
    });
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
  public getColumnMetadataByProperty(propertyName: string): ColumnMetadata {
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
  public getColumnMetadataByDbCol(dbColName: string): ColumnMetadata {
    return this.dbColMap.get(dbColName);
  }

  /**
   * Liefert den DB-Spaltennamen für den Propertynamen @param{propertyName}
   */
  public getDbColumnName(propertyName: string): string {
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
    return this.getSpecialColumn(SpecialColumns.PRIMARY_KEY);
  }

  /**
   * Liefert die Version Column oder undefined
   */
  public get versionColumn(): ColumnMetadata {
    return this.getSpecialColumn(SpecialColumns.VERSION);
  }

  /**
   * Liefert die Client Column oder undefined
   */
  public get clientColumn(): ColumnMetadata {
    return this.getSpecialColumn(SpecialColumns.CLIENT);
  }

  /**
   * Liefert die Secret Column oder undefined
   */
  public getSecretColumn(propertyName: string): ColumnMetadata {
    return this.getSpecialColumn(SpecialColumns.SECRET, propertyName);
  }

  /**
   * Liefert die Test Column oder undefined
   */
  public get testColumn(): ColumnMetadata {
    return this.getSpecialColumn(SpecialColumns.TEST);
  }


  /**
   * Liefert die Status Column oder undefined
   */
  public get statusColumn(): ColumnMetadata {
    return this.getColumnMetadataByProperty(EntityStatusHelper.PROPERTY_NAME_STATUS);
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


  /**
   * Liefert eine zugehörige ServiceRequests-Instanz.
   *
   * Wenn die Table keine EnumTable ist, wird die ServiceRequests-Instanz über den @param{injector} ermittelt;
   * sonst wird ein entsprechender @see{EnumTableServiceRequests} erzeugt.
   *
   * @param {*} injector
   * @returns {IServiceCrud}
   *
   * @memberOf TableMetadata
   */
  public getServiceRequestsInstance<T extends IEntity<TId>, TId extends IToString>(injector: any, store: Store):
    ICrudServiceRequests<T, TId> {
    if (this.options instanceof EnumTableOptions) {
      return new EnumTableServiceRequests(this, store, this.options.enumValues);
    } else {
      let serviceRequestsClazz = this.serviceRequestsClazz;

      if (!Types.isPresent(serviceRequestsClazz)) {
        const baseClazz = Types.getBaseClass(this.target);
        if (baseClazz) {
          const baseMetadata = this._metadataStorage.findTableMetadata(baseClazz);
          serviceRequestsClazz = baseMetadata.serviceRequestsClazz;
          TableMetadata.logger.warn(`über rekursive Methode lösen.`);
        }
      }
      return injector.get(serviceRequestsClazz);
    }
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



  private addInternal(metadata: ColumnMetadata) {
    this.propertyMap.set(metadata.propertyName, metadata);
    this.dbColMap.set(metadata.options.name, metadata);

    if (metadata.options.primary) {
      this.setSpecialColumn(metadata.propertyName, SpecialColumns.PRIMARY_KEY);
    }
  }

}