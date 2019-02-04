/**
 * Provide several mathematical helpers
 *
 * @export
 * @class MathTools
 */
export class MathTools {

    /**
     * Calulate the variation between two numbers.
     *
     * @static
     * @param {number} valueA
     * @param {number} valueB
     * @param {boolean} [roundValue]
     * @returns {number}
     * @memberof MathTools
     */
    static variationBetweenTwoNumbers(valueA: number, valueB: number, roundValue?: boolean): number {
        if (!valueA || valueA === 0) {
            return 0;
        }

        let delta = ((valueB - valueA) / Math.abs(valueA)) * 100;
        delta = roundValue ? Math.round(delta) : delta;
        return delta;
    }
}
