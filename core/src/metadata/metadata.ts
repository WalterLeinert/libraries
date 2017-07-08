import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { Assert } from '../util/assert';


/**
 * abstrakte Basisklasse zur Modellierung von Metadaten
 *
 * @export
 * @abstract
 * @class Metadata
 * @template T
 */
export abstract class Metadata<T> {

  protected constructor(private _target: T, private _name: string) {
  }

  /**
   * Liefert den Namen
   *
   * @readonly
   * @type {string}
   * @memberof Metadata
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Liefert das Target (Klasse, Object, etc.)
   *
   * @readonly
   * @type {T}
   * @memberof Metadata
   */
  public get target(): T {
    return this._target;
  }

  public abstract get targetName(): string;


  public static getTargetName(target: string | Funktion) {
    Assert.notNull(target);

    if (Types.isString(target)) {
      const targetName = target as string;
      Assert.notNullOrEmpty(targetName);
      return targetName;
    }
    return (target as Funktion).name;
  }
}

