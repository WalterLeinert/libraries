// Fluxgate
import { Color, InstanceAccessor } from '@fluxgate/core';


/**
 * Die Konfiguration für Anzeige eines Objekt (z.B. in einer Grid-Zeile) mit den entsprechenden Properties
 *
 */
export interface IRowDisplayInfo {

  /**
   * steuert, ob die Zeile editierbar ist
   */
  editable?: boolean;

  /**
   * Color-Property der Zeile
   */
  color?: Color | InstanceAccessor<any, Color>;
}