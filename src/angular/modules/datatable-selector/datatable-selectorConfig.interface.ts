/**
 * Die Konfiguration einer Tabellenspalte
 */
export interface IColumnInfo {

    /**
     * der Anzeigename der Spalte
     * 
     * @type {string}
     * @memberOf IColumnInfo
     */
    textField: string;

    /**
     * der Propertyname der Spalte (-> Wert)
     * 
     * @type {string}
     * @memberOf IFieldOptions
     */
    valueField: string;
}


/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {

    /**
     * Die Spaltenkonfiguration
     * 
     * @type {IColumnInfo[]}
     * @memberOf IDataTableSelectorOptions
     */
    columnInfos: IColumnInfo[];
}