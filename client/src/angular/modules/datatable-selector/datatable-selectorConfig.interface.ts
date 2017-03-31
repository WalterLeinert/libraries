import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';
import { IRowDisplayInfo } from '../../../base/displayConfiguration/rowDisplayInfo.interface';

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