export declare class JsonReader {
    /**
     * Liest eine Json-Datei @param{jsonPath} und liefert das entsprechede Json-Objekt als @see{T}
     */
    static readJsonSync<T>(jsonPath: string): T;
    /**
     * Liest eine Json-Datei @param{jsonPath} und liefert das entsprechede Json-Objekt als @see{T} im Callback @see{cb}
     */
    static readJson<T>(jsonPath: string, cb: any): void;
}
