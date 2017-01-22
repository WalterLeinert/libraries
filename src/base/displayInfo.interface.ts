/**
 * Die Konfiguration für Anzeige eines Objektwerts mit einem Property-Tupel
 *
 */
export interface IDisplayInfo {

    /**
     * anzuzeigender Propertyname
     * 
     * @type {string}
     * @memberOf IDisplayInfo
     */
    textField: string;

    /**
     * Propertyname des angebundenen Werts
     * 
     * @type {string}
     * @memberOf IDisplayInfo
     */
    valueField: string;
}