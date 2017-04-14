export declare class MathUtil {
    /**
     * von https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     *
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    private static decimalAdjust(type, value, exp);
    static round10(value: number, exp: number): number;
    static floor10(value: number, exp: number): number;
    static ceil10(value: number, exp: number): number;
}
