import { Identifiable } from '../base/uniqueIdentifiable';
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
export declare class Tuple<T1, T2> extends Identifiable {
    item1: T1;
    item2: T2;
    constructor(item1: T1, item2: T2);
    toString(): string;
    /**
     * liefert den Hashcode für das Tuple
     *
     * HINWEIS: der Hashcode wird über toString() berechnet
     *
     * @readonly
     * @type {number}
     * @memberOf Tuple
     */
    readonly instanceId: number;
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
export declare class Tuple3<T1, T2, T3> extends Tuple<T1, T2> {
    item1: T1;
    item2: T2;
    item3: T3;
    constructor(item1: T1, item2: T2, item3: T3);
    toString(): string;
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
export declare class Tuple4<T1, T2, T3, T4> extends Tuple3<T1, T2, T3> {
    item1: T1;
    item2: T2;
    item3: T3;
    item4: T4;
    constructor(item1: T1, item2: T2, item3: T3, item4: T4);
    toString(): string;
}
