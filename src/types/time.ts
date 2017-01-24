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
     * Creates an instance of Time.
     * 
     * @param {Hour} _hour
     * @param {number} _minute
     * @param {number} _second
     * 
     * @memberOf Time
     */
    constructor(private _hour: Hour, private _minute: number, private _second: number) {
        Assert.that(_hour >= 0 && _hour <= 23);
        Assert.that(_minute >= 0 && _minute <= 59);
        Assert.that(_second >= 0 && _second <= 59);
    }

    /**
     * Liefert die String-Repräsentation.
     * 
     * @returns {string}
     * 
     * @memberOf Time
     */
    public toString(): string {
        return `${this.hour}:${this.minute}:${this.second}`;
    }

    /**
     * Liefert die Stunden
     * 
     * @readonly
     * @type {Hour}
     * @memberOf Time
     */
    get hour(): Hour {
        return this._hour;
    }

    /**
     * Liefert die Minuten
     * 
     * @readonly
     * @type {number}
     * @memberOf Time
     */
    get minute(): number {
        return this._minute;
    }


    /**
     * Liefert die Sekunden
     * 
     * @readonly
     * @type {number}
     * @memberOf Time
     */
    get second(): number {
        return this._second;
    }
}