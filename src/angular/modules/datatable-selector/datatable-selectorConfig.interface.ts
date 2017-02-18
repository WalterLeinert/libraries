import { IControlDisplayInfo } from '../../../base/controlDisplayInfo.interface';
import { IDisplayInfo } from '../../../base/displayInfo.interface';
import { IRowDisplayInfo } from '../../../base/rowDisplayInfo.interface';

/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {


  /**
   * die Zeilenkonfiguration für Anzeige/Editierbarkeit
   * 
   * @type {IRowDisplayInfo}
   * @memberOf IDataTableSelectorConfig
   */
  rowInfo?: IRowDisplayInfo;

    /**
     * Die Spaltenkonfiguration für Anzeige/Wertebinding
     * 
     * @type {IControlDisplayInfo[]}
     * @memberOf IDataTableSelectorConfig
     */
    columnInfos: IControlDisplayInfo[];
}