import { IDisplayInfo } from '@fluxgate/client';


/**
 * Optionen für den Aufbau der Anzeigeliste
 */
export interface IDropdownSelectorConfig {

  /**
   * Anzeige der Optionen
   */
  displayInfo?: IDisplayInfo;

  /**
   * Falls true, wird vor allen Werten der Auswahlliste ein spezieller Eintrag eingefügt
   */
  allowNoSelection?: boolean;

  /**
   * der entsprechende Anzeigetext
   */
  allowNoSelectionText?: string;

  valuesCacheable?: boolean;
}
