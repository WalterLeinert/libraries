export class Clone {

    /**
     * Liefert einen Clone von @param{value} mittels @see{JSON.stringify} und @see{JSON.parse}.
     * 
     * @static
     * @template T
     * @param {T} value
     * @returns {T}
     * 
     * @memberOf Clone
     */
    public static clone<T>(value: T): T {
        let cloneString = JSON.stringify(value);
        return JSON.parse(cloneString);
    }
}