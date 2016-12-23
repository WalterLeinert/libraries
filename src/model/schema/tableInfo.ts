import { ColumnInfo } from './columnInfo';

/**
 * Modelliert eine DB-Tabelle
 * 
 * @export
 * @class TableInfo
 */
export class TableInfo {
    private _columns: Array<ColumnInfo>;

    constructor(private _name: string) {
        this._columns = new Array<ColumnInfo>();
    }

    /**
     * Liefert den Tabellennamen
     * 
     * @readonly
     * @type {string}
     * @memberOf TableInfo
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Liefert die Spalteninfos
     * 
     * @readonly
     * @type {ColumnInfo[]}
     * @memberOf TableInfo
     */
    public get columns(): ColumnInfo[] {
        return this._columns;
    }

    /**
     * Fügt eine Spalteninfo hinzu
     * 
     * @param {ColumnInfo} info
     * 
     * @memberOf TableInfo
     */
    public addColumn(info: ColumnInfo) {
        this.columns.push(info);
    }
}

