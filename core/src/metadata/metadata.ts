import { Assertion } from '../base/assertion';

/**
 * abstrakte Basisklasse zur Modellierung von Metadaten
 *
 * @export
 * @abstract
 * @class Metadata
 * @template T
 */
export abstract class Metadata<T> {

  protected constructor(private _target: T) {
    Assertion.notNull(_target);
  }

  /**
   * Liefert den Namen des Targets
   *
   * @readonly
   * @type {string}
   * @memberof Metadata
   */
  public abstract get targetName(): string;

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
}

