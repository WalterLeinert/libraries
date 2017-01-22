import { IDisplayInfo } from '../../../angular/common/base/displayInfo.interface';

/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {

    /**
     * Die Spaltenkonfiguration für Anzeige/Wertebinding
     * 
     * @type {IDisplayInfo[]}
     * @memberOf IDataTableSelectorOptions
     */
    columnInfos: IDisplayInfo[];
}