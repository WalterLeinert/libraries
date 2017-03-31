export class MathUtil {

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
    private static decimalAdjust(type: string, value: number, exp: number): number {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;

        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        let valueString = value.toString().split('e');
        value = Math[type](+(valueString[0] + 'e' + (valueString[1] ? (+valueString[1] - exp) : -exp)));
        // Shift back
        valueString = value.toString().split('e');
        return +(valueString[0] + 'e' + (valueString[1] ? (+valueString[1] + exp) : exp));
    }

    public static round10(value: number, exp: number) {
        return MathUtil.decimalAdjust('round', value, exp);
    }

    public static floor10(value: number, exp: number) {
        return MathUtil.decimalAdjust('floor', value, exp);
    }

    public static ceil10(value: number, exp: number) {
        return MathUtil.decimalAdjust('ceil', value, exp);
    }
}