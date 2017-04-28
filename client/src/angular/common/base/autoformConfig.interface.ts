import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';


/**
 * Die Konfiguration des Formulars
 */
export interface IAutoformConfig {
  /**
   * Liste der Formukarfelder, die nicht angezeigt werden
   */
  hiddenFields?: string[];


  /**
   * Die Spaltenkonfiguration für Anzeige/Wertebinding
   *
   * @type {IControlDisplayInfo[]}
   * @memberOf IDataTableSelectorConfig
   */
  columnInfos: IControlDisplayInfo[];
}

/**
 * Interface für die Navigation auf das generische Formular Autoform (@see{AutoformComponent})
 */
export interface IAutoformNavigation {
  /**
   * Die Id der zugehörigen Entity
   */
  entityId: any;

  /**
   * Der Name der zugehörigen Entity-Klasse
   */
  entity: string;

  /**
   * die Konfiguration des Formulars @see{IAutoformConfig} als JSON-String
   */
  autoformConfig?: string;
}