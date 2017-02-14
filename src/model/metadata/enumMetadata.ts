import { ObjectType } from '../../base/objectType';
import { PropertyAccessor } from '../../types';
import { Assert } from '../../util/assert';
import { MetadataStorage } from './metadataStorage';


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
export class EnumMetadata<T, TText, TId> {
    private _textField: string;
    private _valueField: string;


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
        private _dataSource: RelationTypeInFunction,
        private _foreignText: PropertyAccessor<T, TText>,
        private _foreignId: PropertyAccessor<T, TId>) {
    }

    /**
     * Gets the property's type to which this relation is applied.
     */
    public get dataSource(): Function {
        Assert.that(this._dataSource instanceof Function);
        return (this._dataSource as () => any)();
    }

    public get foreignText(): PropertyAccessor<T, TText> {
        return this._foreignText;
    }

    public get foreignId(): PropertyAccessor<T, TId> {
        return this._foreignId;
    }


    public setFields(textField: string, valueField: string) {
        // Assert.notNullOrEmpty(textField);
        // Assert.notNullOrEmpty(valueField);

        this._textField = textField;
        this._valueField = valueField;
    }


    /**
     * Liefert den Namen der Property in der Target-Modelklasse, deren Wert im GUI angezeigt werden soll
     * 
     * @readonly
     * @type {string}
     * @memberOf EnumMetadata
     */
    public get textField(): string {
        if (this._textField === undefined) {
            this.setupFields();
        }

        return this._textField;
    }

    /**
     * Liefert den Namen der Property in der Target-Modelklasse, deren Wert im entspr. Modell angebunden werden soll.
     * 
     * @readonly
     * @type {string}
     * @memberOf EnumMetadata
     */
    public get valueField(): string {
        if (this._valueField === undefined) {
            this.setupFields();
        }

        return this._valueField;
    }

    private setupFields() {
        const targetMetadata = MetadataStorage.instance.findTableMetadata(this.dataSource);
        const map = targetMetadata.createPropertiesMap();
        this._textField = this.foreignText(map as T) as any as string;
        this._valueField = this.foreignId(map as T) as any as string;
    }
}
