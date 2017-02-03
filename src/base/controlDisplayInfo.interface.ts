// ANgular
import { PipeTransform } from '@angular/core';


import { ControlType } from '../angular/modules/common/controlType';

import { IDisplayInfo } from './displayInfo.interface';


/**
 * Die Konfiguration für Anzeige eines Objektwerts über einen Style und/oder
 * ein ensprechendes Control.
 */
export interface IControlDisplayInfo extends IDisplayInfo {

    /**
     * Html-Style
     * 
     * @type {string}
     * @memberOf IDisplayInfo
     */
    style?: string;

    /**
     * Der Type des Controls für die Anzeige/Eingabe
     * 
     * @type {ControlType}
     * @memberOf IDisplayInfo
     */
    controlType?: ControlType;

    pipe?: PipeTransform;

    pipeArgs?: string;
}