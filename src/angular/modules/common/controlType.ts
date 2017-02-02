/**
 * Steuert in Html-Templates den Einbau entsprechender Controls
 * 
 * @export
 * @enum {number}
 */
export enum ControlType {

    /**
     * Texteingabefeld
     */
    Input,

    /**
     * Datumsfeld
     */
    Date,

    /**
     * Auswahl aus Werteliste mit @see{DataTableSelector} (mehrspaltig, Werte z.B. aus DB-Tabelle)
     */
    DataTableSelector,

    /**
     * Auswahl aus Werteliste mit @see{DropdownSelector} (Dropdown, einspaltig)
     */
    DropdownSelector,

    /**
     * Checkbox für Auswahl eines boolschen Werts
     */
    Checkbox,

    /**
     * TODO ?? Werteliste??? <-> DropdownSelector
     */
    Radio
}