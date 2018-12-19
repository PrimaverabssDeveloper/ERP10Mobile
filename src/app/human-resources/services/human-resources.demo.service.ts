import { InstanceHttpRequestService, DomService } from '../../core/services';
import { HumanResourcesService } from './human-resources.service';
import { HttpClient } from '@angular/common/http';
import { Salaries } from '../models';

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
        private http: HttpClient
    ) {
        super(instanceHttpRequestService, domService);
    }
    // #endregion

    // #region 'Public Methods'

    /**
     * Get the demo salaries.
     *
     * @returns {Promise<Salaries>}
     * @memberof HumanResourcesService
     */
    async getSalaries(): Promise<Salaries> {
        return this.getDemoDataWithFileName<Salaries>('salaries.json');
    }

    // #endregion


    // #region 'Private Methods'
    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/human-resources/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }
    // #endregion
}
