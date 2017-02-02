import { IDisplayInfo } from '../../../base/displayInfo.interface';
import { IControlDisplayInfo } from '../../../base/controlDisplayInfo.interface';

/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {

    /**
     * Die Spaltenkonfiguration für Anzeige/Wertebinding
     * 
     * @type {IControlDisplayInfo[]}
     * @memberOf IDataTableSelectorConfig
     */
    columnInfos: IControlDisplayInfo[];
}