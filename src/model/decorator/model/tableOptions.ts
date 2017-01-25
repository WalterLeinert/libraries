/**
 * Optionen für Tabledecorator
 * 
 * @export
 * @interface TableOptions
 */
export interface TableOptions {
    /**
     * DB Tabellen-/Viewname
     */
    name?: string;

    /**
     * true, falls View und keine Tabelle
     */
    isView?: boolean;
}