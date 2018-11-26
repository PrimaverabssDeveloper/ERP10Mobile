/**
 * Representes a money value.
 *
 * @export
 * @interface MoneyValue
 */
export interface MoneyValue {
    /**
     * The value of money.
     *
     * @type {number}
     * @memberof MoneyValue
     */
    value: number;

    /**
     * The currency.
     *
     * @type {string}
     * @memberof MoneyValue
     */
    currency: string;
}
