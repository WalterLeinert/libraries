/**
 * String Utilities
 */
export declare class StringUtil {
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
    static splice(text: string, start: number, delCount: number, textToInsert?: string): string;
}
