import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';


export interface IColumnGroupInfo {
  /**
   * Name der column group
   */
  name: string;

  /**
   * falls gesetzt wird keine spezielle Gruppe angezeigt, sondern nur die Controls
   */
  hidden: boolean;

  /**
   * Reihenfolge der column group
   */
  order?: number;

  /**
   * Die Konfiguration der Controls für Anzeige/Wertebinding
   */
  columnInfos: IControlDisplayInfo[];
}


/**
 * Die Konfiguration des Formulars
 */
export interface IAutoformConfig {
  /**
   * Liste der Formukarfelder, die nicht angezeigt werden
   */
  hiddenFields?: string[];


  /**
   * Die Info zu dem column groups
   * Hinweis: auch wenn im Model keine column group konfiguriert ist, gibt es hier genau
   * eine column group mit der Property hidden == true
   */

  groupInfos: IColumnGroupInfo[];
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