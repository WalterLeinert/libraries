let leftPad = require('left-pad');
import { StringBuilder } from './../base/stringBuilder';
import { Assert } from './../util/assert';

/**
 * Modelliert einen Stundentyp
 */
export type Hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
    12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;


/**
 * Modelliert eine Zeit (HH:mm:ss), da Date keine reine Zeit unterstützt
 * 
 * @export
 * @class Time
 */
export class Time {

    /**
     * Erzeugt aus dem String @param{text} eine @see{Time}-Instanz.
     * 
     * @static
     * @param {string} text
     * @returns {Time}
     * 
     * @memberOf Time
     */
    public static parse(text: string): Time {
        Assert.notNullOrEmpty(text);

        let parts = text.split(':');
        Assert.that(parts.length === 3);

        let hour = +parts[0];
        let minute = +parts[1];
        let second = +parts[2];

        Assert.that(hour >= 0 && hour < 24);

        return new Time(hour as Hour, minute, second);
    }


    /**
     * Erzeugt eine @see{Time}-Instanz aus dem angegebenen Objekt, falls dieses
     * die Properties der @see{Time}-Klasse enthält.
     * 
     * @static
     * @param {*} obj
     * @returns
     * 
     * @memberOf Time
     */
    public static createFrom(obj: any) {
        let hour: Hour = obj['hour'];
        let minute: number = obj['minute'];
        let second: number = obj['second'];

        let sb = new StringBuilder();
        if (hour === undefined) {
            sb.appendWithDelimiter('hour');
        }
        if (minute === undefined) {
            sb.appendWithDelimiter('minute');
        }
        if (second === undefined) {
            sb.appendWithDelimiter('second');
        }
        Assert.that(sb.isEmpty, `Property ${sb} fehlt.`);

        return new Time(hour, minute, second);
    }

    /**
     * Creates an instance of Time.
     * 
     * @param {Hour} _hour
     * @param {number} _minute
     * @param {number} _second
     * 
     * @memberOf Time
     */
    constructor(public hour: Hour, public minute: number, public second: number) {
        Assert.that(hour >= 0 && hour <= 23);
        Assert.that(minute >= 0 && minute <= 59);
        Assert.that(second >= 0 && second <= 59);
    }

    /**
     * Liefert die String-Repräsentation.
     * 
     * @returns {string}
     * 
     * @memberOf Time
     */
    public toString(): string {
        return `${leftPad(this.hour, 2, 0)}:${leftPad(this.minute, 2, 0)}:${leftPad(this.second, 2, 0)}`;
    }
}