// tslint:disable:max-classes-per-file

import { Identifiable } from '../base/uniqueIdentifiable';
import { Utility } from '../util/utility';

/**
 * 2-Tupel (Basisklasse)
 *
 * Die Klasse ist über @see{instanceId} identifizierbar und hashable.
 *
 * @export
 * @class Tuple
 * @template T1
 * @template T2
 */
export class Tuple<T1, T2> extends Identifiable {
  constructor(public item1: T1, public item2: T2) {
    super();
  }

  public toString(): string {
    return this.item1.toString() + '-' + this.item2.toString();
  }

  /**
   * liefert den Hashcode für das Tuple
   *
   * HINWEIS: der Hashcode wird über toString() berechnet
   *
   * @readonly
   * @type {number}
   * @memberOf Tuple
   */
  public get instanceId(): number {
    return Utility.hashCodeForString(this.toString());
  }
}


/**
 * 3-Tupel
 *
 * @export
 * @class Tuple3
 * @template T1
 * @template T2
 * @template T3
 */
export class Tuple3<T1, T2, T3> extends Tuple<T1, T2> {
  constructor(public item1: T1, public item2: T2, public item3: T3) {
    super(item1, item2);
  }

  public toString(): string {
    return super.toString() + '-' + this.item3.toString();
  }
}


/**
 * 4-Tupel
 *
 * @export
 * @class Tuple4
 * @template T1
 * @template T2
 * @template T3
 * @template T4
 */
export class Tuple4<T1, T2, T3, T4> extends Tuple3<T1, T2, T3> {
  constructor(public item1: T1, public item2: T2, public item3: T3, public item4: T4) {
    super(item1, item2, item3);
  }

  public toString(): string {
    return super.toString() + '-' + this.item4.toString();
  }
}