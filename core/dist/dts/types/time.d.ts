import { Hour } from './hour';
import { ShortTime } from './shortTime';
/**
 * Modelliert eine Zeit (HH:mm:ss), da Date keine reine Zeit unterstützt
 *
 * @export
 * @class Time
 */
export declare class Time extends ShortTime {
    second: number;
    /**
     * Erzeugt aus dem String @param{text} eine @see{Time}-Instanz.
     *
     * @static
     * @param {string} text
     * @returns {Time}
     *
     * @memberOf Time
     */
    static parse(text: string): Time;
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
    static createFrom(obj: any): Time;
    /**
     * Erzeugt aus der Zeitangabe in Sekunden eine @see{Time}-Instanz.
     *
     * @static
     * @param {number} seconds
     * @returns {Time}
     *
     * @memberOf Time
     */
    static createFromSeconds(seconds: number): Time;
    /**
     * Creates an instance of Time.
     *
     * @param {Hour} _hour
     * @param {number} _minute
     * @param {number} _second
     *
     * @memberOf Time
     */
    constructor(hour: Hour, minute: number, second: number);
    /**
     * Liefert die String-Repräsentation.
     *
     * @returns {string}
     *
     * @memberOf Time
     */
    toString(): string;
    toSeconds(): number;
    /**
     * Addiert zur Zeit der aktuellen Instanz die Zeit @param{time} und liefert
     * das Ergebnis.
     *
     * @param {Time} time
     * @returns {Time}
     *
     * @memberOf Time
     */
    add(time: Time): Time;
    /**
     * Subrahiert von der Zeit der aktuellen Instanz die Zeit @param{time} und liefert
     * das Ergebnis.
     *
     * @param {Time} time
     * @returns {Time}
     *
     * @memberOf Time
     */
    subtract(time: Time): Time;
}
