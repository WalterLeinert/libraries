/**
 * String Utilities
 */
export class StringUtil {

    /**
     * Liefert true, falls @param {text} null oder leer ist.
     */
    public static isNullOrEmpty(text: string) {
        return (!text || text == null || text.length <= 0);
    }
}