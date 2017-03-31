// Fluxgate
import { Color, InstanceAccessor } from '@fluxgate/common';


/**
 * Die Konfiguration für Anzeige eines Objekt (z.B. in einer Grid-Zeile) mit den entsprechenden Properties
 *
 */
export interface IRowDisplayInfo {

  /**
   * steuert, ob die Zeile editierbar ist
   * 
   * @type {boolean}
   * @memberOf IRowDisplayInfo
   */
  editable?: boolean;

  /**
   * Color-Property der Zeile
   * 
   * @type {Color | InstanceAccessor<any, Color>} - Farbe oder Lambda-Expression für Ermittlung der Farbe
   * @memberOf IRowDisplayInfo
   */
  color?: Color | InstanceAccessor<any, Color>;
}