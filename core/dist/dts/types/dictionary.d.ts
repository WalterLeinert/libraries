import { Identifiable } from './../base/uniqueIdentifiable';
import { IDictionary } from './dictionary.interface';
export declare type KeyTypes = number | string | Identifiable | any;
/**
 * Generische Implementierung eines Dictionaries
 *
 * @export
 * @class Dictionary
 * @implements {IDictionary<TKey, TValue>}
 * @template TKey
 * @template TValue
 */
export declare class Dictionary<TKey extends KeyTypes, TValue> implements IDictionary<TKey, TValue> {
    private stringDict;
    private numberDict;
    private idToObjectMapper;
    private isInitialized;
    private keyType;
    /**
     * Fügt unter dem Key @param{key} einen neuen Wert @param{value} hinzu.
     *
     * @param {TKey} key
     * @param {TValue} value
     * @returns
     *
     * @memberOf Dictionary
     */
    set(key: TKey, value: TValue): void;
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
    remove(key: TKey): void;
    /**
     * Liefert true, falls ein Eintrag für den Key @param{key} existiert.
     *
     * @param {TKey} key
     * @returns {boolean}
     *
     * @memberOf Dictionary
     */
    containsKey(key: TKey): boolean;
    /**
     * Liefert alle Keys.
     *
     * @readonly
     * @type {TKey[]}
     * @memberOf Dictionary
     */
    readonly keys: TKey[];
    /**
     * Liefert alle Werte.
     *
     * @readonly
     * @type {TValue[]}
     * @memberOf Dictionary
     */
    readonly values: TValue[];
    /**
     * Leert das Dictionary
     *
     * @memberOf Dictionary
     */
    clear(): void;
    /**
     * Liefert die Anzahl der Einträge im Dictionary
     *
     * @returns {number}
     *
     * @memberOf Dictionary
     */
    readonly count: number;
    /**
     * Liefert true, falls das Dictionary leer ist.
     *
     * @returns {boolean}
     *
     * @memberOf Dictionary
     */
    readonly isEmpty: boolean;
    private initialize(keyType);
}
