import { Assert } from '../../util/assert';
import { Dictionary } from '../../types';
import { ColumnMetadata } from '../metadata/columnMetadata';
import { TableOptions } from '../decorator/model/tableOptions';


/**
 *  Modelliert Metadaten für Modellklasse/DB-Tabelle
 * 
 * @export
 * @class TableMetadata
 */
export class TableMetadata {
    private _columnMetadata: ColumnMetadata[] = [];
    private propertyMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
    private dbColMap: Dictionary<string, ColumnMetadata> = new Dictionary<string, ColumnMetadata>();
    private _primaryKeyColumn; ColumnMetadata;
    private _service: Function;

    constructor(public target: Function, public options: TableOptions) {
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
            this._primaryKeyColumn = metadata;
        }
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
        return <T>Reflect.construct(this.target, []);
    }

    /**
     * Erzeugt aus dem JSON-Object @param{json} eine Modelinstanz vom Typ @see{T}
     * 
     * @template T
     * @param {Function} target
     * @param {*} json
     * @param {boolean} mapColumns - falls true, sind im Json-Objekt die Propertynamen die DB-Spaltennamen und müssen gemappt werden
     * @returns {T}
     * 
     * @memberOf TableMetadata
     */
    public createModelInstance<T>(json: any, mapColumns = true): T {
        let instance = this.createEntity();

        // alle Properties der Row über Reflection ermitteln        
        let props = Reflect.ownKeys(json);

        // ... und dann die Werte der Zielentity zuweisen
        for (let propName of props) {
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
        let dbInstance = {};

        for (let col of this.columnMetadata) {
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

        let colMetadata = this.propertyMap.get(propertyName);
        Assert.notNull(colMetadata, `Propertyname ${propertyName} nicht definiert.`);
        Assert.that(colMetadata.options.persisted, `Propertyname ${propertyName} muss Option persisted=true haben.`);

        return colMetadata.options.name;
    }

    /**
     * Liefert die Primary Key Column oder undefined
     */
    public get primaryKeyColumn(): ColumnMetadata {
        return this._primaryKeyColumn;
    }


    /**
     * Registriert den zugehörigen Service (Class/Constructor Function)
     */
    public registerService(service: Function) {
        this._service = service;
    }

    /**
     * Liefert den zugehörigen Service (Class/Constructor Function)
     */
    public get service(): Function {
        return this._service;
    }


    /**
     * Liefert den Klassennamen des zugehörigen Modells (z.B. 'Artikel')
     */
    public get className(): string {
        return this.target.name;
    }
}