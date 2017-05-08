import { Metadata } from './metadata';

/**
 * abstrakte Basisklasse zur Modellierung von Property-Metadaten
 *
 * @export
 * @abstract
 * @class Metadata
 * @template T
 */
export abstract class PropertyMetadata extends Metadata<Object> {

  protected constructor(target: Object, name: string) {
    super(target, name);
  }

  public get targetName(): string {
    return this.target.constructor.name;
  }
}