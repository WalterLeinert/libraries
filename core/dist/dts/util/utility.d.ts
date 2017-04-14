export declare class Utility {
    /**
     * Liefert eine Hashcode für den String @param{text}
     *
     * http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     *
     * @static
     * @param {string} text
     * @returns {number}
     *
     * @memberOf Utility
     */
    static hashCodeForString(text: string): number;
    /**
     * Liefert true, falls @param {value} null oder leer ist.
     */
    static isNullOrEmpty<T extends {
        length: number;
    }>(value: T): boolean;
}
