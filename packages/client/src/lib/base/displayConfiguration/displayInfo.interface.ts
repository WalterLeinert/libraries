// Fluxgate
import { Color, InstanceAccessor } from '@fluxgate/core';
import { DataType } from './dataType';


/**
 * Die Konfiguration für Anzeige eines Objektwerts mit einem Property-Tupel
 *
 */
export interface IDisplayInfo {

  /**
   * anzuzeigender Propertyname
   */
  textField: string;

  /**
   * Propertyname des angebundenen Werts
   */
  valueField: string;

  /**
   * steuert, ob das Control Werteingaben zulässt
   */
  editable?: boolean;

  /**
   * Propertyname des angebundenen Werts
   */
  color?: Color | InstanceAccessor<any, Color>;

  /**
   * Der Typ der Property
   */
  dataType?: DataType;

  /**
   * Plichtfeld?
   */
  required?: boolean;
}