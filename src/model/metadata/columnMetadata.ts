import * as moment from 'moment';
import { ColumnOptions } from '../decorator/columnOptions';
import { ColumnTypes } from './columnTypes';


/**
 * Modelliert Metadaten für Modell-/DB-Attribute
 * 
 * @export
 * @class ColumnMetadata
 */
export class ColumnMetadata {

    constructor(public target: Function, public propertyName: string, public propertyType: string, public options: ColumnOptions) {
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
                if (value instanceof Date) {
                    rval = value;
                } else if (typeof value === "string") {
                    rval = new Date(value);
                } else {
                    throw new Error(`Column ${this.propertyName}: Konvertierung von Datumswert ${value} nicht möglich.`);
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
                if (moment(value).isValid())
                    return moment(value).format("YYYY-MM-DD");
                else return "0000-00-00";

            case ColumnTypes.TIME:
                if (moment(value).isValid())
                    return moment(value).format("HH:mm:ss");
                else return "00:00:00";

            case ColumnTypes.DATETIME:
                if (moment(value).isValid())
                    return moment(value).format("YYYY-MM-DD HH:mm:ss");
                else return "0000-00-00 00:00:00";

            case ColumnTypes.JSON:
                return JSON.stringify(value);
        }

        return value;
    }

}

