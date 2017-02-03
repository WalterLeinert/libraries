
export interface IDictionary<TKey, TValue> {
    /**
     * Liefert alle Keys.
     * 
     * @readonly
     * @type {TKey[]}
     * @memberOf Dictionary
     */
    keys: TKey[];

    /**
     * Liefert alle Werte.
     * 
     * @readonly
     * @type {TValue[]}
     * @memberOf Dictionary
     */
    values: TValue[];


    /**
     * Liefert true, falls das Dictionary leer ist.
     * 
     * @returns {boolean}
     * 
     * @memberOf Dictionary
     */
    isEmpty: boolean;

    /**
     * Liefert die Anzahl der Einträge im Dictionary
     * 
     * @returns {number}
     * 
     * @memberOf Dictionary
     */
    count: number;

    /**
     * Fügt unter dem Key @param{key} einen neuen Wert @param{value} hinzu.
     * 
     * @param {TKey} key
     * @param {TValue} value
     * @returns
     * 
     * @memberOf Dictionary
     */
    set(key: TKey, value: TValue);

    /**
     * Liefert den Wert zum Key @param{key} oder undefined.
     * 
     * @param {TKey} key
     * @returns {TValue} value
     * 
     * @memberOf Dictionary
     */
    get(key: TKey): TValue;

    /**
     * Entfernt den Eintrag unter dem Key @param{key}.
     * 
     * @param {TKey} key
     * @returns
     * 
     * @memberOf Dictionary
     */
    remove(key: TKey);

    /**
     * Leert das Dictionary
     *
     * @memberOf Dictionary
     */
    clear();

    /**
     * Liefert true, falls ein Eintrag für den Key @param{key} existiert.
     * 
     * @param {TKey} key
     * @returns {boolean}
     * 
     * @memberOf Dictionary
     */
    containsKey(key: TKey): boolean;
}
