import { IDisplayInfo } from '../../../base/displayInfo.interface';

/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {

    /**
     * Die Spaltenkonfiguration für Anzeige/Wertebinding
     * 
     * @type {IDisplayInfo[]}
     * @memberOf IDataTableSelectorConfig
     */
    columnInfos: IDisplayInfo[];
}