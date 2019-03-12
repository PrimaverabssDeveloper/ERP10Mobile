import { InstanceHttpRequestService, DomService, InstanceService } from '../../core/services';
import { HumanResourcesService } from './human-resources.service';
import { HttpClient } from '@angular/common/http';
import { Salaries, SalaryDocument } from '../models';
import { ResponseContentType } from '@angular/http';

/**
 * The Human Resources Service provide all data needed to the Human Resources Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class HumanResourcesService
 */
export class HumanResourcesDemoService extends HumanResourcesService {

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
        private http: HttpClient
    ) {
        super(instanceHttpRequestService, domService, instanceService);
    }
    // #endregion

    // #region 'Public Methods'

    /**
     * Get the demo salaries.
     *
     * @returns {Promise<Salaries>}
     * @memberof HumanResourcesService
     */
    async getSalaries(companyKey: string): Promise<Salaries> {
        return this.getDemoDataWithFileName<Salaries>('salaries.json');
    }

    /**
     * Get the demo pdf file for the provided document.
     *
     * @param {SalaryDocument} document
     * @returns {Promise<Blob>}
     * @memberof HumanResourcesService
     */
    async getPdfFromDocument(document: SalaryDocument): Promise<Blob> {
        const path = `../assets/human-resources/demo-data/hr_demo_pdf.pdf`;

        return this.http.get(path, { responseType: 'blob'})
                        .toPromise();
    }

    // #endregion


    // #region 'Private Methods'
    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/human-resources/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }
    // #endregion
}
