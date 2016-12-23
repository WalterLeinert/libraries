export enum DataType {
    Number = 0,
    String,
    Date
}


/**
 * Modelliert eine DB-Spalte
 * 
 * @export
 * @class ColumnInfo
 */
export class ColumnInfo {
    private _nullable: boolean;
    private _type: DataType;


    /**
     * Creates an instance of ColumnInfo.
     * 
     * @param {string} _name            - Spaltenname
     * @param {string} type             - Spaltentyp (DB)
     * @param {string} nullableString   - Nullable (DB: Wert YES|NO)
     * @param {string} _default         - Defaultwert
     * @param {boolean} primaryKey      - Primary Key
     * @param {boolean} autoIncrement   - Hat Autoinkrement
     * 
     * @memberOf ColumnInfo
     */
    constructor(private _name: string, type: string, nullableString: string, private _default: string,
        private _primaryKey: boolean, private _autoIncrement: boolean) {

        switch (nullableString) {
            case 'YES':
                this._nullable = true;
                break;

            case 'NO':
                this._nullable = false;
                break;

            default: throw new Error('Column ' + _name + ': value for nullable invalid: ' + nullableString);
        }


        switch (type) {
            case 'int':
            case 'tinyint':
            case 'decimal':
                this._type = DataType.Number;
                break;

            case 'date':
            case 'datetime':
                this._type = DataType.Date;
                break;

            case 'varchar':
                this._type = DataType.String;
                break;

            default: throw new Error('Column ' + _name + ': type invalid: ' + type);
        }
    }

    /**
     * Liefert den Spaltennamen
     * 
     * @readonly
     * @type {string}
     * @memberOf ColumnInfo
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Liefert den Spaltentyp
     * 
     * @readonly
     * @type {DataType}
     * @memberOf ColumnInfo
     */
    public get type(): DataType {
        return this._type;
    }

    /**
     * Liefert true, falls nullable. 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf ColumnInfo
     */
    public get isNullable(): boolean {
        return this._nullable;
    }

    /**
     * Liefert den Defaultwert
     * 
     * @readonly
     * @type {string}
     * @memberOf ColumnInfo
     */
    public get default(): string {
        return this._default;
    }

    /**
     * Liefert true, falls Primary Key
     * 
     * @readonly
     * @type {boolean}
     * @memberOf ColumnInfo
     */
    public get isPrimaryKey(): boolean {
        return this._primaryKey;
    }

    /**
     * Liefert true, falls die Spalte Autoinkrement unterstützt
     * 
     * @readonly
     * @type {boolean}
     * @memberOf ColumnInfo
     */
    public get hasAutoIncrement(): boolean {
        return this._autoIncrement;
    }
}