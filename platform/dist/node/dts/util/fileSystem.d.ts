/**
 * Hilfsklasse für Filesystem-Operationen
 */
export declare class FileSystem {
    /**
     * Liefert true, falls die Datei @param{path} existiert und lesbar ist.
     */
    static fileExists(path: string): boolean;
    /**
     * Liefert true, falls der Pfad @param{path} ein Verzeichnis ist.
     */
    static directoryExists(path: string): boolean;
    /**
     * Liefert den Inhalt der Datei unter dem Pfad @param{path} mit dem Encoding @param{encoding}.
     * Fehler werden mit Hilfe des @param{errorLogger} Callbacks für ein bestimmtes Topic @param{topic}
     * ausgeben.
     *
     * @static
     * @param {(message: string) => void} errorLogger
     * @param {string} path
     * @param {string} topic
     * @returns {string} - undefined bei Fehler
     *
     * @memberOf FileSystem
     */
    static readTextFile(errorLogger: (message: string) => void, path: string, topic: string, encoding?: string): string;
}
