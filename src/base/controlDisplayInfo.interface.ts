import { IDisplayInfo } from './displayInfo.interface';
import { ControlType } from '../angular/modules/common/controlType';


/**
 * Die Konfiguration für Anzeige eines Objektwerts über einen Style und/oder
 * ein ensprechendes Control.
 */
export interface IControlDisplayInfo extends IDisplayInfo {

    /**
     * Html-Style
     * 
     * @type {string}
     * @memberOf IDisplayInfo
     */
    style?: string;

    /**
     * Der Type des Controls für die Anzeige/Eingabe
     * 
     * @type {ControlType}
     * @memberOf IDisplayInfo
     */
    controlType?: ControlType;
}