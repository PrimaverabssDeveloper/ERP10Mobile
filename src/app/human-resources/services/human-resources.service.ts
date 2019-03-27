import { InstanceHttpRequestService, DomService, InstanceService, ModulesService } from '../../core/services';
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
    private static readonly DOCUMENT_PDF_MONTH = (document: SalaryDocument, year: number, month: number) =>
            `/humanresources/documents?companykey=${document.companyKey}&` +
            `type=${document.docType}&` +
            `signature=${document.docSignature}&` +
            `employeeId=${document.employeeId}&` +
            `year=${year}&` +
            `month=${month}`

    private static readonly DOCUMENT_PDF_YEAR = (document: SalaryDocument, year: number) =>
            `/humanresources/documents?companykey=${document.companyKey}&` +
            `type=${document.docType}&` +
            `signature=${document.docSignature}&` +
            `employeeId=${document.employeeId}&` +
            `year=${year}`

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
        protected instanceService: InstanceService,
        protected modulesService: ModulesService
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
    async getPdfFromDocument(document: SalaryDocument, year: number, month?: number): Promise<Blob> {
        let endpoint: string;

        if (month) {
            endpoint = HumanResourcesService.DOCUMENT_PDF_MONTH(document, year, month);
        } else {
            endpoint = HumanResourcesService.DOCUMENT_PDF_YEAR(document, year);
        }

        let pdfBlob: Blob;
        try {
            pdfBlob = await this.instanceHttpRequestService.getBlob(endpoint);
        } catch (error) {
            console.log(error);
            return null;
        }

        return pdfBlob;
    }

    getCompanies(): ModuleCompany[] {

        const hrModule = this.instanceService.currentInstance.modules.find(m => m.name === HrModuleDefinition.key);
        return hrModule ? hrModule.companies : null;
    }

    async setModulePassword(password: string): Promise<boolean> {
        return await this.modulesService.setModulePassword(HrModuleDefinition.key.toLowerCase(), password);
    }

    async verifyModulePassword(password: string): Promise<boolean> {
        return await this.modulesService.verifyModulePassword(HrModuleDefinition.key, password);
    }

    async verifyModuleHasPassword(): Promise<boolean> {
        return await this.modulesService.verifyModuleHasPassword(HrModuleDefinition.key);
    }

    async removeModulePassword(): Promise<boolean> {
        return await this.modulesService.removeModulePassword(HrModuleDefinition.key);
    }

    // #endregion
}
