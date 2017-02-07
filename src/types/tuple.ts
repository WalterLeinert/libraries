// tslint:disable:max-classes-per-file


/**
 * 2-Tupel 
 * 
 * @export
 * @class Tuple
 * @template T1
 * @template T2
 */
export class Tuple<T1, T2> {
    constructor(public item1: T1, public item2: T2) {
    }

    public toString(): string {
        return this.item1.toString() + '-' + this.item2.toString();
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
export class Tuple3<T1, T2, T3> {
    constructor(public item1: T1, public item2: T2, public item3: T3) {
    }

    public toString(): string {
        return this.item1.toString() + '-' + this.item2.toString() + '-' + this.item3.toString();
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
export class Tuple4<T1, T2, T3, T4> {
    constructor(public item1: T1, public item2: T2, public item3: T3, public item4: T4) {
    }

    public toString(): string {
        return this.item1.toString() + '-' + this.item2.toString() + '-' + this.item3.toString() +
            '-' + this.item4.toString();
    }
}