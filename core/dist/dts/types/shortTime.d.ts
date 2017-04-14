import { Hour } from './hour';
/**
 * Modelliert eine Zeit (HH:mm), da Date keine reine Zeit unterstützt
 *
 * @export
 * @class ShortTime
 */
export declare class ShortTime {
    hour: Hour;
    minute: number;
    /**
     * Erzeugt aus dem String @param{text} eine @see{ShortTime}-Instanz.
     *
     * @static
     * @param {string} text
     * @returns {ShortTime}
     *
     * @memberOf ShortTime
     */
    static parse(text: string): ShortTime;
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
    static createFrom(obj: any): ShortTime;
    /**
     * Erzeugt aus der Zeitangabe in Minuten eine @see{ShortTime}-Instanz.
     *
     * @static
     * @param {number} minutes
     * @returns {ShortTime}
     *
     * @memberOf ShortTime
     */
    static createFromMinutes(minutes: number): ShortTime;
    /**
     * Creates an instance of ShortTime.
     *
     * @param {Hour} _hour
     * @param {number} _minute
     *
     * @memberOf ShortTime
     */
    constructor(hour: Hour, minute: number);
    /**
     * Liefert die String-Repräsentation.
     *
     * @returns {string}
     *
     * @memberOf ShortTime
     */
    toString(): string;
    toMinutes(): number;
    /**
     * Liefert die Zeit in Stunden als Dezimalzahl. Ist @param{decimalPlaces} angegeben,
     * dann werden nur die entsprechende Anzahl von Nachkommastellen berücksichtigt.
     *
     * @param {number} [decimalPlaces]
     * @returns
     *
     * @memberOf ShortTime
     */
    toHours(decimalPlaces?: number): number;
    /**
     * Addiert zur Zeit der aktuellen Instanz die Zeit @param{time} und liefert
     * das Ergebnis.
     *
     * @param {ShortTime} time
     * @returns {ShortTime}
     *
     * @memberOf ShortTime
     */
    add(time: ShortTime): ShortTime;
    /**
     * Subrahiert von der Zeit der aktuellen Instanz die Zeit @param{time} und liefert
     * das Ergebnis.
     *
     * @param {ShortTime} time
     * @returns {ShortTime}
     *
     * @memberOf ShortTime
     */
    subtract(time: ShortTime): ShortTime;
}
