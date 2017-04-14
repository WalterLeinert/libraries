/**
 * Runtime Assertions v.a. für Programmierfehler (fail hard and early)
 *
 * @export
 * @class Assert
 */
export declare class Assert {
    static ok(condition: boolean, message?: string): void;
    /**
     * Stellt sicher, dass @param{condition} erfüllt ist.
     * Wirft einen @see{AssertionError} falls nicht.
     *
     * @static
     * @param {boolean} condition
     * @param {string} [message]
     *
     * @memberOf Assert
     */
    static that(condition: boolean, message?: string): void;
    /**
     * Stellt sicher, dass die Werte vom Typ {T} @param{value1} und @param{value2} gleich sind.
     * Wirft einen @see{AssertionError} falls nicht.
     *
     * @static
     * @param {boolean} condition
     * @param {string} [message]
     *
     * @memberOf Assert
     */
    static equal<T>(value1: T, value2: T, message?: string): void;
    /**
     * Stellt sicher, dass der Wert vom Typ {T} @param{value} nicht null ist.
     * Wirft einen @see{AssertionError} falls nicht.
     *
     * @static
     * @param {boolean} condition
     * @param {string} [message]
     *
     * @memberOf Assert
     */
    static notNull<T>(value: T, message?: string): void;
    /**
     * Stellt sicher, dass @param{subject} nicht null oder leer ist.
     * Wirft einen @see{AssertionError} falls nicht.
     *
     * @static
     * @param {(string | any[])} subject
     * @param {string} [message]
     *
     * @memberOf Assert
     */
    static notNullOrEmpty(subject: string | any[], message?: string): void;
}
