import { IControlDisplayInfo } from '@fluxgate/client';


/**
 * Interface mit einige Methoden für die Zusammenarbeit mit AutoformControlsComponent
 */
export interface IAutoform {


  /**
   * Liefert true, falls Feld zu @param{info} mit dem Wert @param{value} nicht anzuzeigen ist
   *
   * @param {IControlDisplayInfo} info
   * @param value
   * @returns {boolean}
   */
  isHidden(info: IControlDisplayInfo, value: any): boolean;

  /**
   * Liefert true, falls die Daten zu @param{info} nicht änderbar sind
   *
   * @param {IControlDisplayInfo} info
   * @returns {boolean}
   */
  isReadonly(info: IControlDisplayInfo): boolean;

  /**
   * Liefert die Farbe für den Wert @param{value} und für @param{info}
   */
  getColor(value: any, info: IControlDisplayInfo): string;

  /**
   * Liefert den Typ eines html-input Fields für die angegebene Info @see{info}
   *
   * @param {IControlDisplayInfo} info
   * @returns {string}
   */
  getInputType(info: IControlDisplayInfo): string;

  /**
   * Liefert die Validierungsfehler für das angegebene Control @param{controlName} und die
   * FormGroup @param{groupName}
   *
   * @protected
   * @param {string} controlName
   * @param {string} [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns {string}
   *
   * @memberOf CoreComponent
   */
  getFormErrors(controlName: string, groupName?: string): string;
}