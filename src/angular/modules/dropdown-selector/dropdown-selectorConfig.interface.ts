import { IDisplayInfo } from '../../../base';

/**
 * Optionen für den Aufbau der Anzeigeliste
 */
export interface IDropdownSelectorConfig {

    /**
     * Anzeige der Optionen 
     * 
     * @type {IDisplayInfo}
     * @memberOf IDropdownSelectorConfig
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
}
