import { IDictionary } from '.';

import { IToString } from './../base/toString.interface';
import { UniqueIdentifiable } from './../base/uniqueIdentifiable';
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
  UniqueIdentifiable,
  Undefined
}

export type KeyTypes = number | string | UniqueIdentifiable | any; 


/**
 * Generische Implementierung eines Dictionaries
 * 
 * @export
 * @class Dictionary
 * @implements {IDictionary<TKey, TValue>}
 * @template TKey
 * @template TValue
 */
export class Dictionary<TKey extends KeyTypes, TValue> implements IDictionary<TKey, TValue> {
  private stringDict: { [key: string]: any } = {};
  private numberDict: { [key: number]: any } = {};
  private idToObjectMapper: { [id: number]: any } = {};

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
  public set(key: TKey, value: TValue) {
    if (Types.isString(key)) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.String);
      this.stringDict[(key as any as string)] = value;
      this.initialize(KeyType.String);
      return;
    }

    if (Types.isNumber(key)) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.Number);
      this.numberDict[(key as any as number)] = value;
      this.initialize(KeyType.Number);
      return;
    }

    if (key instanceof UniqueIdentifiable) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.UniqueIdentifiable);
      this.idToObjectMapper[key.instanceId] = key;
      this.numberDict[key.instanceId] = value;
      this.initialize(KeyType.UniqueIdentifiable);
      return;
    }

    throw new Error(`Unsupported key: ${JSON.stringify(key)}`);
  }

  /**
   * Liefert den Wert zum Key @param{key} oder undefined.
   * 
   * @param {TKey} key
   * @returns {TValue} value
   * 
   * @memberOf Dictionary
   */
  public get(key: TKey): TValue {
    if (Types.isString(key)) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.String);
      return this.stringDict[(key as any as string)];
    }

    if (Types.isNumber(key)) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.Number);
      return this.numberDict[(key as any as number)];
    }

    if (key instanceof UniqueIdentifiable) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.UniqueIdentifiable);
      return this.numberDict[key.instanceId];
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
      delete this.stringDict[(key as any as string)];
      return;
    }

    if (Types.isNumber(key)) {
      Assert.that(this.keyType === KeyType.Number);
      delete this.numberDict[(key as any as number)];
      return;
    }

    if (key instanceof UniqueIdentifiable) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.UniqueIdentifiable);
      delete this.idToObjectMapper[key.instanceId];
      delete this.numberDict[key.instanceId];
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
      return this.stringDict[(key as any as string)] !== undefined;
    }

    if (Types.isNumber(key)) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.Number);
      return this.numberDict[(key as any as number)] !== undefined;
    }

    if (key instanceof UniqueIdentifiable) {
      Assert.that(!this.isInitialized || this.keyType === KeyType.UniqueIdentifiable);
      return this.numberDict[key.instanceId] !== undefined;
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
        keys = Object.keys(this.stringDict) as any as TKey[];
      } else if (this.keyType === KeyType.Number) {
        keys = Object.keys(this.numberDict).map((item) => {
          return parseInt(item, 10) as any as TKey;
        });
      } else if (this.keyType === KeyType.UniqueIdentifiable) {
        for (const k in this.idToObjectMapper) {
          if (k) {
            keys.push(this.idToObjectMapper[k]);
          }
        }
      } else {
        throw new Error(`Unsupported keyType: ${this.keyType}`);
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
    const values: TValue[] = [];

    if (this.isInitialized) {
      if (this.keyType === KeyType.String) {
        for (const k in this.stringDict) {
          if (k) {
            values.push(this.stringDict[k]);
          }
        }
      } else if (this.keyType === KeyType.Number || this.keyType === KeyType.UniqueIdentifiable) {
        for (const k in this.numberDict) {
          if (k) {
            values.push(this.numberDict[k]);
          }
        }
      } else {
        throw new Error(`Unsupported keyType: ${this.keyType}`);
      }
    }

    return values;
  }


  /**
   * Leert das Dictionary
   * 
   * @memberOf Dictionary
   */
  public clear() {
    this.stringDict = {};
    this.numberDict = {};
    this.idToObjectMapper = {};    
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
    if (this.keyType === KeyType.Number || this.keyType === KeyType.UniqueIdentifiable) {
      return Object.keys(this.numberDict).length;
    }

    throw new Error(`Invalid Operation`);
  }


  /**
   * Liefert true, falls das Dictionary leer ist.
   * 
   * @returns {boolean}
   * 
   * @memberOf Dictionary
   */
  public get isEmpty(): boolean {
    return this.count <= 0;
  }


  private initialize(keyType: KeyType) {
    this.keyType = keyType;
    this.isInitialized = true;
  }
}