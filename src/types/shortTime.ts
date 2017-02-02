let leftPad = require('left-pad');
import { IAttributeSelector } from '../model/query/attributeSelector.interface';
import { StringBuilder } from './../base/stringBuilder';
import { Assert } from './../util/assert';

import { Hour } from './hour';


/**
 * Modelliert eine Zeit (HH:mm), da Date keine reine Zeit unterstützt
 * 
 * @export
 * @class ShortTime
 */
export class ShortTime {

    /**
     * Erzeugt aus dem String @param{text} eine @see{ShortTime}-Instanz.
     * 
     * @static
     * @param {string} text
     * @returns {ShortTime}
     * 
     * @memberOf ShortTime
     */
    public static parse(text: string): ShortTime {
        Assert.notNullOrEmpty(text);

        let parts = text.split(':');
        Assert.that(parts.length >= 2);

        if (parts.length > 2) {
            let seconds = +parts[2];
            Assert.that(seconds === 0, `Zeit ${text}: Falls Sekunden angegeben sind, darf der Wert nur 00 sein.`);
        }

        let hour = +parts[0];
        let minute = +parts[1];

        return new ShortTime(hour as Hour, minute);
    }


    /**
     * Erzeugt eine @see{ShortTime}-Instanz aus dem angegebenen Objekt, falls dieses
     * die Properties der @see{ShortTime}-Klasse enthält.
     * 
     * @static
     * @param {*} obj
     * @returns
     * 
     * @memberOf ShortTime
     */
    public static createFrom(obj: any) {
        let hour: Hour = obj['hour'];
        let minute: number = obj['minute'];

        let sb = new StringBuilder();
        if (hour === undefined) {
            sb.appendWithDelimiter('hour');
        }
        if (minute === undefined) {
            sb.appendWithDelimiter('minute');
        }
        Assert.that(sb.isEmpty, `Property ${sb} fehlt.`);

        return new ShortTime(hour, minute);
    }

    /**
     * Erzeugt aus der Zeitangabe in Minuten eine @see{ShortTime}-Instanz.
     * 
     * @static
     * @param {number} minutes
     * @returns {ShortTime}
     * 
     * @memberOf ShortTime
     */
    public static createFromMinutes(minutes: number): ShortTime {
        let hour = Math.floor(minutes / 60);
        let minute = Math.floor(minutes - hour * 60);

        return new ShortTime(<Hour>hour, minute);
    }


    /**
     * Creates an instance of ShortTime.
     * 
     * @param {Hour} _hour
     * @param {number} _minute
     * 
     * @memberOf ShortTime
     */
    constructor(public hour: Hour, public minute: number) {
        Assert.that(hour >= 0 && hour <= 23);
        Assert.that(minute >= 0 && minute <= 59);
    }


    /**
     * Liefert die String-Repräsentation.
     * 
     * @returns {string}
     * 
     * @memberOf ShortTime
     */
    public toString(): string {
        return `${leftPad(this.hour, 2, 0)}:${leftPad(this.minute, 2, 0)}`;
    }


    public toMinutes(): number {
        return this.hour * 60 + this.minute;
    }

    /**
    * Addiert zur Zeit der aktuellen Instanz die Zeit @param{time} und liefert
    * das Ergebnis.
    * 
    * @param {ShortTime} time
    * @returns {ShortTime}
    * 
    * @memberOf ShortTime
    */
    public add(time: ShortTime): ShortTime {
        let timeInMinutes = this.toMinutes() + time.toMinutes();
        return ShortTime.createFromMinutes(timeInMinutes);
    }

    /**
     * Subrahiert von der Zeit der aktuellen Instanz die Zeit @param{time} und liefert
     * das Ergebnis.
     * 
     * @param {ShortTime} time
     * @returns {ShortTime}
     * 
     * @memberOf ShortTime
     */
    public subtract(time: ShortTime): ShortTime {
        let timeInMinutes = this.toMinutes() - time.toMinutes();
        Assert.that(timeInMinutes >= 0);
        return ShortTime.createFromMinutes(timeInMinutes);
    }
}