import { Funktion } from '../base/objectType';
import { Metadata } from './metadata';

/**
 * abstrakte Basisklasse zur Modellierung von Class-Metadaten
 *
 * @export
 * @abstract
 * @class Metadata
 * @template T
 */
export abstract class ClassMetadata extends Metadata<Funktion> {

  protected constructor(target: Funktion, name: string) {
    super(target, name);
  }

  public get targetName(): string {
    return this.target.name;
  }
}