import { IService } from '../angular/services';
import { DataType } from './dataType';
import { IDisplayInfo } from './displayInfo.interface';

export interface IEnumDisplayInfo extends IDisplayInfo {

    /**
     * Liefert die zugehörige Service-Instanz, falls der @see{controlType} den 
     * Wert @see{ControlType.DropdownSelector} hat.
     * 
     * @type {*}
     * @memberOf IControlDisplayInfo
     */
    selectorDataService?: IService;
}