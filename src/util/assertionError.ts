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
        super(message);
    }

}