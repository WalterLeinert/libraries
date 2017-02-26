// Angular
import { PipeTransform } from '@angular/core';

import { ControlType } from '../angular/modules/common/controlType';
import { PipeType } from './../angular/services/pipe.service';
import { IDateDisplayInfo } from './dateDisplayInfo.interface';
import { IDisplayInfo } from './displayInfo.interface';
import { IEnumDisplayInfo } from './enumDisplayInfo.interface';
import { TextAlignment } from './textAlignment';


/**
 * Die Konfiguration für Anzeige eines Objektwerts über einen Style und/oder
 * ein ensprechendes Control.
 */
export interface IControlDisplayInfo extends IDisplayInfo {

  /**
   * Html-Style
   * 
   * @type {string}
   * @memberOf IControlDisplayInfo
   */
  style?: string;


  /**
   * Die Ausrichtung des Werts
   * 
   * @type {TextAlignment}
   * @memberOf IControlDisplayInfo
   */
  textAlignment?: TextAlignment;

  /**
   * Der Type des Controls für die Anzeige/Eingabe
   * 
   * @type {ControlType}
   * @memberOf IControlDisplayInfo
   */
  controlType?: ControlType;

  /**
   * Anzeigeinformation für Enums, falls @see{controlType} den Wert @see{ControlType.DropdownSelector} hat.
   * 
   * @type {*}
   * @memberOf IControlDisplayInfo
   */
  enumInfo?: IEnumDisplayInfo;

  /**
   * Anzeigeinformation für Datum
   * 
   * @type {*}
   * @memberOf IControlDisplayInfo
   */
  dateInfo?: IDateDisplayInfo;

  /**
   * Der Name der Pipe, über die der Wert formatiert werden soll oder eine Pipe-Instanz
   * 
   * @type {PipeTypes | PipeTransform}
   * @memberOf IControlDisplayInfo
   */
  pipe?: PipeType | PipeTransform;


  /**
   * Pipe-Argumente
   * 
   * @type {string}
   * @memberOf IControlDisplayInfo
   */
  pipeArgs?: string;


  /**
   * Die Locale der Pipe.
   * 
   * @type {string}
   * @memberOf IControlDisplayInfo
   */
  pipeLocale?: string;
}