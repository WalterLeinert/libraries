import {ColumnType} from "../metadata/columnTypes";

export interface ColumnOptions {

    /**
     * Workaround für Metadata-Problem mit Date: Typ der Property
     */
    propertyType?: ColumnType;

    /**
     * DB-Spaltenname
     */
    name?: string;

    /**
     * Typ
     */
    type?: ColumnType;

    /**
     * Spalte ist primary key.
     */
    readonly primary?: boolean;

    /**
     * Autoinkrement wird für Spalte verwendet.
     * Nur für eine einzige Spalte möglich und Spalte muss primary key sein. 
     */
    readonly generated?: boolean;

    /**
     * Spaltenwerte sind unique
     */
    readonly unique?: boolean;

    /**
     * Spaltenwert kann null sein.
     */
    nullable?: boolean;

    /**
     * Column comment.
     */
    readonly comment?: string;

    /**
     * Defaultwert.
     */
    readonly default?: any;

}