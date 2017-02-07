import { Assert } from './../util/assert';
import { StringBuilder } from './stringBuilder';

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



    /**
     * Ändert den String @param{text}, indem ein Textbereich entfernt wird und/oder ein 
     * neuer String eingefügt wird 
     * 
     * @static
     * @param {string} text - der zu modifiziernede String
     * @param {number} start - Index, ab dem der String @{text} geändert wird
     * @param {number} delCount - Anzahl der zu entfernenden Zeichen in @param{text} ab @param{start}
     * @param {string} textToInsert - einzufügender Text
     * @returns {string} der neue String
     * 
     * @memberOf StringUtil
     */
    public static splice(text: string, start: number, delCount: number, textToInsert?: string): string {
        Assert.notNull(text);
        Assert.that(start >= 0 && start <= text.length);
        Assert.that(delCount >= 0 && delCount <= text.length);
        Assert.that(start + delCount <= text.length);
        // Assert.notNullOrEmpty(textToInsert);
        const sb = new StringBuilder();

        sb.append(text.slice(0, start));
        if (textToInsert) {
            sb.append(textToInsert);
        }

        if (delCount) {
            sb.append(text.slice(start + delCount));
        } else {
            sb.append(text.slice(start));
        }

        return sb.toString();
    }

}