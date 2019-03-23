
import { SalesTableRowData } from './sales-table-row-data';

/**
 * Defines the event that is provided when the table is updated.
 *
 * @export
 * @interface SalesTableData
 */
export interface SalesTableData {
    /**
     * The current year label.
     *
     * @type {string}
     * @memberof SalesTableData
     */
    currentYearLabel: string;

    /**
     * The previouse year label;
     *
     * @type {string}
     * @memberof SalesTableData
     */
    previouseYearLabel: string;

    /**
     * The currency used for all monetary values.
     *
     * @type {string}
     * @memberof SalesTableData
     */
    currency: string;

    /**
     * The data for all table rows.
     *
     * @type {SalesTableRowData[]}
     * @memberof SalesTableData
     */
    rows: SalesTableRowData[];
}
