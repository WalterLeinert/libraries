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

  protected constructor(target: Funktion) {
    super(target);
  }



  /**
   * liefert den Namen der Klasse (Target)
   */
  public get targetName(): string {
    return this.target.name;
  }
}