import { IDictionary } from '.';

import { IToString } from './../base/toString.interface';
import { Assert } from './../util/assert';
import { Types } from './types';


/**
 * Der Key-Typ des Dictionary
 * Hinweis: in javascript sind als Key-Typen nur string und number erlaubt.
 * 
 * @enum {number}
 */
enum KeyType {
    String,
    Number,
    Object,
    Undefined
}


/**
 * Generische Implementierung eines Dictionaries
 * 
 * @export
 * @class Dictionary
 * @implements {IDictionary<TKey, TValue>}
 * @template TKey
 * @template TValue
 */
export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    private stringDict: { [key: string]: any } = {};
    private numberDict: { [key: number]: any } = {};

    private stringToObjectMapper: { [name: string]: any } = {};

    private isInitialized: boolean = false;
    private keyType = KeyType.Undefined;


    /**
     * Fügt unter dem Key @param{key} einen neuen Wert @param{value} hinzu.
     * 
     * @param {TKey} key
     * @param {TValue} value
     * @returns
     * 
     * @memberOf Dictionary
     */
    public add(key: TKey, value: TValue) {
        if (Types.isString(key)) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.String);
            this.stringDict[(<string><any>key)] = value;
            this.initialize(KeyType.String);
            return;
        }

        if (Types.isNumber(key)) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.Number);
            this.numberDict[(<number><any>key)] = value;
            this.initialize(KeyType.Number);
            return;
        }

        if (key.toString !== undefined) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.Object);
            this.stringToObjectMapper[key.toString()] = key;
            this.stringDict[key.toString()] = value;
            this.initialize(KeyType.Object);
            return;
        }

        throw new Error(`Unsupported key: ${JSON.stringify(key)}`);
    }


    /**
     * Entfernt den Eintrag unter dem Key @param{key}.
     * 
     * @param {TKey} key
     * @returns
     * 
     * @memberOf Dictionary
     */
    public remove(key: TKey) {
        if (Types.isString(key)) {
            Assert.that(this.keyType === KeyType.String);
            delete this.stringDict[(<string><any>key)];
            return;
        }

        if (Types.isNumber(key)) {
            Assert.that(this.keyType === KeyType.Number);
            delete this.numberDict[(<number><any>key)];
            return;
        }

        if (key.toString !== undefined) {
            Assert.that(this.keyType === KeyType.Object);
            delete this.stringToObjectMapper[key.toString()];
            delete this.stringDict[key.toString()];
            return;
        }

        throw new Error(`Unsupported key: ${JSON.stringify(key)}`);
    }


    /**
     * Liefert true, falls ein Eintrag für den Key @param{key} existiert.
     * 
     * @param {TKey} key
     * @returns {boolean}
     * 
     * @memberOf Dictionary
     */
    public containsKey(key: TKey): boolean {
        if (Types.isString(key)) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.String);
            return this.stringDict[(<string><any>key)] !== undefined;
        }

        if (Types.isNumber(key)) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.Number);
            return this.numberDict[(<number><any>key)] !== undefined;
        }

        if (key.toString !== undefined) {
            Assert.that(!this.isInitialized || this.keyType === KeyType.Object);
            return this.stringDict[key.toString()] !== undefined;
        }

        throw new Error(`Unsupported key: ${JSON.stringify(key)}`);
    }


    /**
     * Liefert alle Keys.
     * 
     * @readonly
     * @type {TKey[]}
     * @memberOf Dictionary
     */
    public get keys(): TKey[] {
        let keys: TKey[] = new Array<TKey>();

        if (this.isInitialized) {
            if (this.keyType === KeyType.String) {
                keys = <TKey[]> <any> Object.keys(this.stringDict);
            } else if (this.keyType === KeyType.Number) {
               keys = Object.keys(this.numberDict).map(item => {
                   return <TKey> <any> parseInt(item)
               });
            } else {
                for (let k in this.stringToObjectMapper) {
                    if (k) {
                        keys.push(this.stringToObjectMapper[k]);
                    }
                }
            }
        }

        return keys;
    }


    /**
     * Liefert alle Werte.
     * 
     * @readonly
     * @type {TValue[]}
     * @memberOf Dictionary
     */
    public get values(): TValue[] {
        let values: TValue[] = [];

        if (this.isInitialized) {
            if (this.keyType === KeyType.String) {
                for (let k in this.stringDict) {
                    if (k) {
                        values.push(this.stringDict[k]);
                    }
                }
            } else if (this.keyType === KeyType.Number) {
                for (let k in this.numberDict) {
                    if (k) {
                        values.push(this.numberDict[k]);
                    }
                }
            } else {
                for (let k in this.stringToObjectMapper) {
                    if (k) {
                        values.push(this.stringDict[k]);
                    }
                }
            }
        }

        return values;
    }


    /**
     * Liefert die Anzahl der Einträge im Dictionary
     * 
     * @returns {number}
     * 
     * @memberOf Dictionary
     */
    public get count(): number {
       if (!this.isInitialized) {
           return 0;
       }

        if (this.keyType === KeyType.String || this.keyType === KeyType.Object) {
            return Object.keys(this.stringDict).length;
        }
        if (this.keyType === KeyType.Number) {
            return Object.keys(this.numberDict).length;
        }

        throw new Error(`Invalid Operation`);
    }

    private initialize(keyType: KeyType) {
        this.keyType = keyType;
        this.isInitialized = true;
    }
}