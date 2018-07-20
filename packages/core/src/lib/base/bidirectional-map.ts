import { Assert } from '../util/assert';


/**
 * Implemetiert eine bidirektionale Map zur Abbildung einer Liste von Werten von Typ T1 auf Werte
 * einer Liste vom Typ T2. Die Listen müssen dieselbe Länge haben und dürfen nicht leer oder null sein.
 *
 */
export class BidirectionalMap<T1, T2> {
  private _values1: T1[];
  private _values2: T2[];
  private _map1To2: Map<T1, T2> = new Map<T1, T2>();
  private _map2To1: Map<T2, T1> = new Map<T2, T1>();

  constructor(values1: T1[], values2: T2[]) {
    Assert.notNullOrEmpty(values1);
    Assert.notNullOrEmpty(values2);
    Assert.that(values1.length === values2.length);

    this._values1 = [...values1];
    this._values2 = [...values2];

    for (let i = 0; i < this._values1.length; i++) {
      this._map1To2.set(this._values1[i], this._values2[i]);
      this._map2To1.set(this._values2[i], this._values1[i]);
    }
  }

  public map1To2(value: T1): T2 {
    return this._map1To2.get(value);
  }

  public map2To1(value: T2): T1 {
    return this._map2To1.get(value);
  }

  public get values1(): T1[] {
    return this._values1;
  }

  public get values2(): T2[] {
    return this._values2;
  }
}