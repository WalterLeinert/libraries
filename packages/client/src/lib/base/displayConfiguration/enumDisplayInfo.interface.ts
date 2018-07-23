import { ICoreServiceRequests } from '@fluxgate/common';
import { IDisplayInfo } from './displayInfo.interface';

export interface IEnumDisplayInfo extends IDisplayInfo {

  /**
   * Liefert die zugehörige ServiceRequests-Instanz, falls der @see{controlType} den
   * Wert @see{ControlType.DropdownSelector} hat.
   */
  selectorDataServiceRequests?: ICoreServiceRequests<any>;
}