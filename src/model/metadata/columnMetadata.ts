import * as moment from 'moment';

import { ShortTime, Time } from '../../types';
import { Assert } from '../../util/assert';
import { ColumnOptions } from '../decorator/model/columnOptions';
import { IValidation, ValidationResult } from './../validation';
import { ColumnType, ColumnTypes } from './columnTypes';

import { EnumMetadata } from '.';

/**
 * Modelliert Metadaten für Modell-/DB-Attribute
 * 
 * @export
 * @class ColumnMetadata
 */
export class ColumnMetadata {
    private validator: IValidation;
    private _enumMetadata: EnumMetadata;

    /**
     * @param {Function} target - Modelklasse
     * @param {string} propertyName - Name der Modelproperty
     * @param {ColumnType} propertyType - Typ der Modelproperty
     * @param {ColumnOptions} options - weitere Propertyeigenschaften
     */
    constructor(public target: Function, public propertyName: string, public propertyType: ColumnType,
        public options: ColumnOptions) {
    }


    /**
     * Wandelt einen Wert @param{value} für die aktuelle Property in einen Wert von Type @see{propertyType}.
     * Normalerweise wird der Wert @param{value} direkt zurückgeliefert.
     * 
     * @param {*} value
     * @returns {*}
     * 
     * @memberOf ColumnMetadata
     */
    public convertToProperty(value: any): any {
        let rval = null;

        switch (this.propertyType) {

            case ColumnTypes.DATE:
            case ColumnTypes.DATETIME:
                if (value instanceof Date) {
                    rval = value;
                } else if (typeof value === 'string') {
                    rval = new Date(value);
                } else {
                    throw new Error(`Column ${this.propertyName}: Konvertierung von Datumswert` +
                        ` ${JSON.stringify(value)} nicht möglich.`);
                }
                break;

            case ColumnTypes.TIME:
                if (value instanceof Time) {
                    rval = value;
                } else if (typeof value === 'string') {
                    rval = Time.parse(value);
                } else {
                    rval = Time.createFrom(value);    // wir interpretieren den Wert als Time
                }
                break;

            case ColumnTypes.SHORTTIME:
                if (value instanceof ShortTime) {
                    rval = value;
                } else if (typeof value === 'string') {
                    rval = ShortTime.parse(value);
                } else {
                    rval = ShortTime.createFrom(value);    // wir interpretieren den Wert als ShortTime
                }
                break;

            default:
                rval = value;
                break;
        }

        return rval;
    }


    /**
     * Wandelt den Quellwert @param{value} in einen Wert vom Zieltyp.
     * 
     * @param {*} propValue
     * @returns {*}
     * 
     * @memberOf ColumnMetadata
     */
    public convertFromProperty(value: any): any {
        switch (this.options.type) {
            case ColumnTypes.BOOLEAN:
                return value === true ? 1 : 0;

            case ColumnTypes.DATE:
                if (moment(value).isValid()) {
                    return moment(value).format('YYYY-MM-DD');
                }
                return '0000-00-00';

            case ColumnTypes.TIME:
                if (value instanceof Time) {
                    return value.toString();
                }
                return '00:00:00';

            case ColumnTypes.SHORTTIME:
                if (value instanceof ShortTime) {
                    return value.toString();
                }
                return '00:00';

            case ColumnTypes.DATETIME:
                if (moment(value).isValid()) {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
                return '0000-00-00 00:00:00';

            case ColumnTypes.JSON:
                return JSON.stringify(value);

            default:
                return value;
        }

    }

    public setValidation(validator: IValidation) {
        this.validator = validator;
    }

    public validate(value: any): ValidationResult {
        Assert.notNull(this.validator);
        return this.validator.validate(value);
    }

    public setEnum(enumMetadata: EnumMetadata) {
        this._enumMetadata = enumMetadata;
    }

    public get enumMetadata(): EnumMetadata {
        return this._enumMetadata;
    }

}