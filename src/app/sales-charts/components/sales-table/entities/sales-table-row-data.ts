
/**
 * Defines the data of each row of the sales table
 *
 * @export
 * @class SalesTableRowData
 */
export interface SalesTableRowData {

    /**
     * The row label
     *
     * @type {string}
     * @memberof SalesTableRowData
     */
    label: string;

    /**
     * The row description.
     *
     * @type {string}
     * @memberof SalesTableRowData
     */
    description: string;

    /**
     * The current year sales value.
     *
     * @type {number}
     * @memberof SalesTableRowData
     */
    currentYearValue: number;

    /**
     * The previous year monetary value.
     *
     * @type {number}
     * @memberof SalesTableRowData
     */
    previousYearValue: number;

    /**
     * The sales variation between the previouse and current year.
     *
     * @type {number}
     * @memberof SalesTableRowData
     */
    deltaPercentageValue: number;

    /**
     * Defines if the current rows has the sommatory of all sales values.
     *
     * @type {boolean}
     * @memberof SalesTableRowData
     */
    isTotal: boolean;
}
