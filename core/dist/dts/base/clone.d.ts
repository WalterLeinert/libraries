export declare class Clone {
    /**
     * Liefert einen Clone von @param{value}
     *
     * @static
     * @template T
     * @param {T} value
     * @returns {T}
     *
     * @memberOf Clone
     */
    static clone<T>(value: T, allowCycles?: boolean): T;
    /**
     * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
     */
    static verifyClone<T>(value: T, clonedValue: T, checkCycles?: boolean): void;
}
