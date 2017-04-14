export declare class Reflection {
    /**
     * Copies all properties of a source instance to a new instance of type T.
     *
     * @static
     * @template T - destination type
     * @param {*} source - source instance
     * @param {{ new (): T }} dest - destination instance type
     * @returns {T} - new destination instance with properties copied from source.
     *
     * @memberOf Reflection
     */
    static copyProperties<T>(source: any, dest: {
        new (): T;
    }): T;
}
