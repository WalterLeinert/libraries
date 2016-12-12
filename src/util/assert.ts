/**
 * Modelliert einen Assertion-Error
 * 
 * @export
 * @class AssertionError
 * @extends {Error}
 */
export class AssertionError extends Error {

    /**
     * Creates an instance of AssertionError.
     * 
     * @param {string} [message] - optionaler Text
     * 
     * @memberOf AssertionError
     */
    constructor(message?: string) {
        super(message)
    }

}



/**
 * Runtime Assertions v.a. für Programmierfehler (fail hard and early)
 * 
 * @export
 * @class Assert
 */
export class Assert {
    public static ok(condition: boolean, message?: string) {
        if (!condition) {
            throw new AssertionError("condition not met" + (message ? ': ' + message : ''));
        }
    }

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
    public static that(condition: boolean, message?: string) {
        if (!condition) {
            throw new AssertionError("condition not met" + (message ? ': ' + message : ''));
        }
    }


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
    public static equal<T>(value1: T, value2: T, message?: string) {
        if (value1 != value2) {
            throw new AssertionError(`value1 ${value1} not equal ${value1}` + (message ? ': ' + message : ''));
        }
    }


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
    public static notNull<T>(value: T, message?: string) {
        if (value == null) {
            throw new AssertionError('value is null' + (message ? ': ' + message : ''));
        }
    }

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
    public static notNullOrEmpty(subject: string | any[], message?: string) {
        Assert.notNull(subject, 'subject');

        if (subject.length <= 0) {
            throw new AssertionError('subject is empty' + (message ? ': ' + message : ''));
        }
    }
}