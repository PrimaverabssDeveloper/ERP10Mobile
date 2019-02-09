
import { SalesTableData } from './sales-table-data';

/**
 * Defines the event that is fired when the table is updated.
 *
 * @export
 * @interface SalesTableUpdatedEvent
 */
export interface SalesTableUpdatedEvent {
    /**
     * The data used to fill the sales table when the event was fired.
     *
     * @type {SalesTableData}
     * @memberof SalesTableUpdatedEvent
     */
    tableData: SalesTableData;
}
