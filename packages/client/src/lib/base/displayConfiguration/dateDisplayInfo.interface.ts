// Fluxgate
import { InstanceAccessor } from '@fluxgate/core';

export interface IDateDisplayInfo {

  /**
   * Liefert das minimal auswählbare Datum
   */
  minDate?: Date | InstanceAccessor<any, Date>;

  /**
   * Liefert das maximal auswählbare Datum
   */
  maxDate?: Date | InstanceAccessor<any, Date>;
}