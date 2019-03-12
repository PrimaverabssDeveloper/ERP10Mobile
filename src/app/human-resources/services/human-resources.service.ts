import { InstanceHttpRequestService, DomService, InstanceService } from '../../core/services';
import { Salaries, SalaryDocument } from '../models';
import { ModuleCompany } from '../../core/entities';
import { HrModuleDefinition } from '../module-definition';

/**
 * The Human Resources Service provide all data needed to the Human Resources Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class HumanResourcesService
 */
export class HumanResourcesService {

    // #region 'Endpoints'
    private static readonly SALARIES_BY_COMPANY = (companyKey: string) => `/humanresources/salaries?companyKey=${companyKey}`;
    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of HumanResourcesService.
     * @param {InstanceHttpRequestService} instanceHttpRequestService
     * @param {DomService} domService
     * @memberof HumanResourcesService
     */
    constructor(
        protected instanceHttpRequestService: InstanceHttpRequestService,
        protected domService: DomService,
        protected instanceService: InstanceService
        ) {

    }
    // #endregion

    // #region 'Public Methods'

    /**
     * Get the salaries.
     *
     * @returns {Promise<Salaries>}
     * @memberof HumanResourcesService
     */
    async getSalaries(companyKey: string): Promise<Salaries> {

        let salesData: Salaries;
        const endpoint = HumanResourcesService.SALARIES_BY_COMPANY(companyKey);
        try {
            salesData = await this.instanceHttpRequestService.get<Salaries>(endpoint);
        } catch (error) {
            console.log(error);
            return null;
        }

        return salesData;
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

    getCompanies(): ModuleCompany[] {

        const hrModule = this.instanceService.currentInstance.modules.find(m => m.name === HrModuleDefinition.key);
        return hrModule ? hrModule.companies : null;
    }

    // #endregion
}
