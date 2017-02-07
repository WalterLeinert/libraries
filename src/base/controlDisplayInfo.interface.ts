// Angular
import { PipeTransform } from '@angular/core';

import { ControlType } from '../angular/modules/common/controlType';
import { PipeTypes } from './../angular/services/pipe.service';
import { IDisplayInfo } from './displayInfo.interface';
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
     * Der Name der Pipe, über die der Wert formatiert werden soll oder eine Pipe-Instanz
     * 
     * @type {PipeTypes | PipeTransform}
     * @memberOf IControlDisplayInfo
     */
    pipe?: PipeTypes | PipeTransform;


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