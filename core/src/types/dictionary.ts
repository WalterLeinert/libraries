import { Identifiable } from './../base/uniqueIdentifiable';
import { Assert } from './../util/assert';
import { IDictionary } from './dictionary.interface';


/**
 * Der Key-Typ des Dictionary
 * Hinweis: in javascript sind als Key-Typen nur string und number erlaubt.
 *
 * @enum {number}
 */
enum KeyType {
  Other,
  Identifiable,
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
  private _map: Map<TKey, TValue> = new Map<TKey, TValue>();

  /**
   * Dictionary für die Zuordnung von Identifiable-Id zu Value
   */
  private idValueDict: { [key: number]: any } = {};

  /**
   * Dictionary für die Zuordnung von Identifiable-Id zu Key
   */
  private idKeyDict: { [id: number]: any } = {};

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
    Assert.notNull(key);
    this.assertValidKey(key);

    if (key instanceof Identifiable) {
      this.idKeyDict[key.instanceId] = key;
      this.idValueDict[key.instanceId] = value;
      this.initialize(KeyType.Identifiable);
    } else {
      this._map.set(key, value);
      this.initialize(KeyType.Other);
    }
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
    Assert.notNull(key);
    this.assertValidKey(key);

    if (key instanceof Identifiable) {
      return this.idValueDict[key.instanceId];
    } else {
      return this._map.get(key);
    }
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
    Assert.notNull(key);
    this.assertValidKey(key);

    if (key instanceof Identifiable) {
      delete this.idKeyDict[key.instanceId];
      delete this.idValueDict[key.instanceId];
    } else {
      this._map.delete(key);
    }
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
    Assert.notNull(key);
    this.assertValidKey(key);

    if (key instanceof Identifiable) {
      return this.idKeyDict[key.instanceId] !== undefined;
    } else {
      return this._map.has(key);
    }
  }


  /**
   * Liefert alle Keys.
   *
   * @readonly
   * @type {TKey[]}
   * @memberOf Dictionary
   */
  public get keys(): TKey[] {
    const keys: TKey[] = new Array<TKey>();

    if (this.isInitialized) {
      if (this.keyType === KeyType.Identifiable) {
        for (const k in this.idKeyDict) {
          if (k) {
            keys.push(this.idKeyDict[k]);
          }
        }
      } else {
        this._map.forEach((v, k) => {
          keys.push(k);
        });
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
    const values: TValue[] = new Array<TValue>();

    if (this.isInitialized) {
      if (this.keyType === KeyType.Identifiable) {
        for (const k in this.idValueDict) {
          if (k) {
            values.push(this.idValueDict[k]);
          }
        }
      } else {
        this._map.forEach((v, k) => {
          values.push(v);
        });
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
    this.idValueDict = {};
    this.idKeyDict = {};
    this._map.clear();
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

    if (this.keyType === KeyType.Identifiable) {
      return Object.keys(this.idValueDict).length;
    } else {
      return this._map.size;
    }
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

  private assertValidKey(key: TKey) {
    if (this.isInitialized) {
      if (this.keyType === KeyType.Identifiable) {
        Assert.that(this.keyType === KeyType.Identifiable && (key instanceof Identifiable),
          `key is no instance of Identifiable`);
      }
    }
  }
}