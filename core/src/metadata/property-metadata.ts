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

  protected constructor(target: T, name: string) {
    super(target, name);
  }

  public get targetName(): string {
    if (this.target instanceof Function) {
      return this.target.name;
    }
    if (this.target instanceof Object) {
      return (this.target as Object).constructor.name;
    }
    throw new NotSupportedException(`name = ${this.name}: not supported target ${Core.stringify(this.target)}`);
  }
}