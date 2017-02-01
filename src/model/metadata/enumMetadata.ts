import { IEnumOptions } from '../decorator/model/enumOptions.interface';

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
     * @param {ColumnOptions} options - weitere Eigenschaften
     */
    constructor(public target: Function, public propertyName: string, public options: IEnumOptions) {
    }
}
