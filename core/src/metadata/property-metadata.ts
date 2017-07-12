import { Core } from '../diagnostics/core';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Metadata } from './metadata';

/**
 * abstrakte Basisklasse zur Modellierung von Property-Metadaten
 *
 * @export
 * @abstract
 * @class Metadata
 * @template T
 */
export abstract class PropertyMetadata<T> extends Metadata<T> {

  protected constructor(target: T, private _name: string) {
    super(target);
  }

  /**
   * Liefert den Propertynamen
   */
  public get name(): string {
    return this._name;
  }


  /**
   * Liefert den Namen des Targets der Property
   */
  public get targetName(): string {
    if (this.target instanceof Function) {
      return this.target.name;
    }
    if (this.target instanceof Object) {
      // tslint:disable-next-line:ban-types
      return (this.target as Object).constructor.name;
    }
    throw new NotSupportedException(`not supported target ${Core.stringify(this.target)}`);
  }
}