import { IControlDisplayInfo, IRowDisplayInfo } from '@fluxgate/client';

/**
 * Die Konfiguration der Komponente @see{DataTableSelectorComponent}
 */
export interface IDataTableSelectorConfig {


  /**
   * die Zeilenkonfiguration für Anzeige/Editierbarkeit
   */
  rowInfo?: IRowDisplayInfo;

  /**
   * Die Spaltenkonfiguration für Anzeige/Wertebinding
   */
  columnInfos: IControlDisplayInfo[];
}