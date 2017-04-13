
/**
 * Optionen für den Aufbau der Anzeigeliste
 */
export interface IDropdownAdapterOptions {
    /**
     * Name der Property, deren Wert in der Auswahlliste angezeigt werden soll
     */
    textField?: string;

    /**
     * Name der Property, deren Wert bei einer Selektion als selectedItem verwendet wird
     */
    valueField?: string;

    /**
     * Falls true, wird vor allen Werten der Auswahlliste ein spezieller Eintrag eingefügt
     */
    allowNoSelection?: boolean;

    /**
     * der entsprechende Anzeigetext
     */
    allowNoSelectionText?: string;
}
