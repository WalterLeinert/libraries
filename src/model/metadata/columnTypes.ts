import { ShortTime, Time } from '../../types';

/**
 * z.T. übernommen aus https://github.com/typeorm/typeorm
 */

/**
 * All data types that column can be.
 */
export type ColumnType = 'string' | 'text' | 'number' | 'integer' | 'int' | 'smallint' | 'bigint' | 'float' | 'double' |
    'decimal' | 'date' | 'time' | 'shorttime' | 'datetime' | 'boolean' | 'json' | 'simple_array';

/**
 * All data types that column can be.
 */
export class ColumnTypes {

    /**
     * SQL VARCHAR type. Your class's property type should be a "string".
     */
    public static STRING: ColumnType = 'string';

    /**
     * SQL CLOB type. Your class's property type should be a "string".
     */
    public static TEXT: ColumnType = 'text';

    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    public static NUMBER: ColumnType = 'number';

    /**
     * SQL INT type. Your class's property type should be a "number".
     */
    public static INTEGER: ColumnType = 'integer';

    /**
     * SQL INT type. Your class's property type should be a "number".
     */
    public static INT: ColumnType = 'int';

    /**
     * SQL SMALLINT type. Your class's property type should be a "number".
     */
    public static SMALLINT: ColumnType = 'smallint';

    /**
     * SQL BIGINT type. Your class's property type should be a "number".
     */
    public static BIGINT: ColumnType = 'bigint';

    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    public static FLOAT: ColumnType = 'float';

    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    public static DOUBLE: ColumnType = 'double';

    /**
     * SQL DECIMAL type. Your class's property type should be a "string".
     */
    public static DECIMAL: ColumnType = 'decimal';

    /**
     * SQL DATETIME type. Your class's property type should be a "Date" object.
     */
    public static DATE: ColumnType = 'date';

    /**
     * SQL TIME type. Your class's property type should be a "Date" object.
     */
    public static TIME: ColumnType = 'time';

    /**
     * SQL TIME type. Your class's property type should be a "Date" object.
     */
    public static SHORTTIME: ColumnType = 'shorttime';

    /**
     * SQL DATETIME/TIMESTAMP type. Your class's property type should be a "Date" object.
     */
    public static DATETIME: ColumnType = 'datetime';

    /**
     * SQL BOOLEAN type. Your class's property type should be a "boolean".
     */
    public static BOOLEAN: ColumnType = 'boolean';

    /**
     * SQL CLOB type. Your class's property type should be any Object.
     */
    public static JSON: ColumnType = 'json';

    /**
     * SQL CLOB type. Your class's property type should be array of string. Note: value in this column 
     * should not contain a comma (",") since this symbol is used to create a string from the array, 
     * using .join(",") operator.
     */
    public static SIMPLE_ARRAY: ColumnType = 'simple_array';

    /**
     * Checks if given type in a string format is supported by ORM.
     */
    public static isTypeSupported(type: string) {
        return this.supportedTypes.indexOf(type as ColumnType) !== -1;
    }

    /**
     * Returns list of all supported types by the ORM.
     */
    static get supportedTypes() {
        return [
            this.STRING,
            this.TEXT,
            this.NUMBER,
            this.INTEGER,
            this.INT,
            this.SMALLINT,
            this.BIGINT,
            this.FLOAT,
            this.DOUBLE,
            this.DECIMAL,
            this.DATE,
            this.TIME,
            this.SHORTTIME,
            this.DATETIME,
            this.BOOLEAN,
            this.JSON,
            this.SIMPLE_ARRAY
        ];
    }

    /**
     * Tries to guess a column type from the given function.
     */
    public static determineTypeFromFunction(type: Function): ColumnType {
        if (type instanceof Date) {
            return ColumnTypes.DATETIME;
        } if (type instanceof Time) {
            return ColumnTypes.TIME;
        } if (type instanceof ShortTime) {
            return ColumnTypes.SHORTTIME;
        } else if (type instanceof Function) {
            const typeName = (type as any as Function).name.toLowerCase();
            switch (typeName) {
                case 'number':
                    return ColumnTypes.NUMBER;
                case 'boolean':
                    return ColumnTypes.BOOLEAN;
                case 'string':
                    return ColumnTypes.STRING;
                case 'date':
                    return ColumnTypes.DATETIME;
                case 'time':
                    return ColumnTypes.TIME;
                case 'shorttime':
                    return ColumnTypes.SHORTTIME;
                case 'object':
                    return ColumnTypes.JSON;
                default:
                    throw new Error(`No ColumnType for type ${typeName}`);
            }

        } else if (type instanceof Object) {
            return ColumnTypes.JSON;

        }
        throw new Error(`Column type of ${type} cannot be determined.`);
        // return undefined;
    }

    public static typeToString(type: Function): string {
        return (type as any).name.toLowerCase();
    }

    public static isTime(type: ColumnType) {
        return type === ColumnTypes.TIME || type === ColumnTypes.SHORTTIME;
    }

    public static isDate(type: ColumnType) {
        return type === ColumnTypes.DATE || type === ColumnTypes.DATETIME;
    }

    /**
     * Checks if column type is numeric.
     */
    public static isNumeric(type: ColumnType) {
        return type === ColumnTypes.NUMBER ||
            type === ColumnTypes.INT ||
            type === ColumnTypes.INTEGER ||
            type === ColumnTypes.BIGINT ||
            type === ColumnTypes.SMALLINT ||
            type === ColumnTypes.DOUBLE ||
            type === ColumnTypes.FLOAT;
    }

}