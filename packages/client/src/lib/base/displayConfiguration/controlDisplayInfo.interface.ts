// Angular
import { PipeTransform } from '@angular/core';

import { ControlType } from '../../angular/common/base/controlType';
import { PipeType } from './../../angular/services/pipe.service';
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
   */
  style?: string;


  /**
   * Die Ausrichtung des Werts
   */
  textAlignment?: TextAlignment;

  /**
   * Liefert true, falls das Control geheime Information (wie Passwort) anzeigen soll
   */
  isSecret?: boolean;

  /**
   * Der Type des Controls für die Anzeige/Eingabe
   */
  controlType?: ControlType;

  /**
   * Anzeigeinformation für Enums, falls @see{controlType} den Wert @see{ControlType.DropdownSelector} hat.
   */
  enumInfo?: IEnumDisplayInfo;

  /**
   * Anzeigeinformation für Datum
   */
  dateInfo?: IDateDisplayInfo;

  /**
   * Der Name der Pipe, über die der Wert formatiert werden soll oder eine Pipe-Instanz
   */
  pipe?: PipeType | PipeTransform;


  /**
   * Pipe-Argumente
   */
  pipeArgs?: string;


  /**
   * Die Locale der Pipe.
   */
  pipeLocale?: string;
}