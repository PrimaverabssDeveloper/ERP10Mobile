import { InstanceHttpRequestService, DomService } from '../../core/services';
import { Salaries, SalaryDocument } from '../models';

/**
 * The Human Resources Service provide all data needed to the Human Resources Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class HumanResourcesService
 */
export class HumanResourcesService {

    // #region 'Constructor'

    /**
     * Creates an instance of HumanResourcesService.
     * @param {InstanceHttpRequestService} instanceHttpRequestService
     * @param {DomService} domService
     * @memberof HumanResourcesService
     */
    constructor(protected instanceHttpRequestService: InstanceHttpRequestService, protected domService: DomService) {

    }
    // #endregion

    // #region 'Public Methods'

    /**
     * Get the salaries.
     *
     * @returns {Promise<Salaries>}
     * @memberof HumanResourcesService
     */
    async getSalaries(): Promise<Salaries> {

        return null;
    }

    /**
     * Get the pdf file for the provided document.
     *
     * @param {SalaryDocument} document
     * @returns {Promise<Blob>}
     * @memberof HumanResourcesService
     */
    async getPdfFromDocument(document: SalaryDocument): Promise<Blob> {
        return null;
    }

    // #endregion
}
