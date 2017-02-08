import { ObjectType } from '../../base/objectType';


/**
 * Function that returns a type of the field. Returned value must be a class used on the relation.
 */
export type RelationTypeInFunction = ((type?: any) => Function) | Function;


/**
 * Modelliert Metadaten für Enum-Modell-/DB-Attribute
 * 
 * @export
 * @class EnumMetadata
 */
export class EnumMetadata {
    /**
     * @param {Function} target - Modelklasse
     * @param {string} propertyName - Name der Modelproperty
     * @param {ColumnOptions} typeFunction - weitere Eigenschaften
     */


    /**
     * Creates an instance of EnumMetadata.
     * 
     * @param {Function} target - Modelklasse
     * @param {string} propertyName - Name der Modelproperty
     * @param {RelationTypeInFunction} dataSource - die Modelklasse, die Enumwerte liefert
     * 
     * @memberOf EnumMetadata
     */
    constructor(public target: Function, public propertyName: string,
        private _dataSource: RelationTypeInFunction) {
    }

    /**
     * Gets the property's type to which this relation is applied.
     */
    public get dataSource(): Function | string { // todo: when this can be a string?
        return this._dataSource instanceof Function ? (this._dataSource as () => any)() : this._dataSource;
    }
}
