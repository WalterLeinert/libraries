import { ControlType } from '../angular/modules/common/controlType';
import { DataType } from './dataType';


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

    /**
     * steuert, ob das Control Werteingaben zulässt
     * 
     * @type {boolean}
     * @memberOf IDisplayInfo
     */
    readonly?: boolean;


    /**
     * Der Typ der Property
     * 
     * @type {string}
     * @memberOf IDisplayInfo
     */
    dataType?: DataType;
}