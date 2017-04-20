// Fluxgate
import { InstanceAccessor } from '@fluxgate/core';

export interface IDateDisplayInfo {

  /**
   * Liefert das minimal auswählbare Datum
   *
   * @type {Date}
   * @memberOf IDateDisplayInfo
   */
  minDate?: Date | InstanceAccessor<any, Date>;

  /**
   * Liefert das maximal auswählbare Datum
   *
   * @type {Date}
   * @memberOf IDateDisplayInfo
   */
  maxDate?: Date | InstanceAccessor<any, Date>;
}