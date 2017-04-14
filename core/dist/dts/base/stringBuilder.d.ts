/**
 * Einfache StringBuilder Implentierung
 *
 * @export
 * @class StringBuilder
 */
export declare class StringBuilder {
    private strings;
    /**
     * Creates an instance of StringBuilder.
     *
     * @param {string} [text]
     *
     * @memberOf StringBuilder
     */
    constructor(text?: string);
    /**
     * Fügt den angegeben Text hinzu.
     *
     * @param {string} text
     *
     * @memberOf StringBuilder
     */
    append(text: string): void;
    /**
     * Falls der StringBuilder noch leer ist, wird vor dem @param{text}
     * der Delimiter @param{delimiter} eingefügt.
     *
     * @param {string} text
     * @param {string} [delimiter=', ']
     *
     * @memberOf StringBuilder
     */
    appendWithDelimiter(text: string, delimiter?: string): void;
    /**
     * Fügt den angegeben Text hinzu und hängt ein EOL an.
     *
     * @param {string} [text]
     *
     * @memberOf StringBuilder
     */
    appendLine(text?: string): void;
    /**
     * Liefert den kompletten Text als @see{string}
     *
     * @returns {string}
     *
     * @memberOf StringBuilder
     */
    toString(): string;
    /**
     * Liefert true, falls der StringBuilder noch leer ist.
     *
     * @readonly
     * @type {boolean}
     * @memberOf StringBuilder
     */
    readonly isEmpty: boolean;
}
