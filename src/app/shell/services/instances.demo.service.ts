

import { HttpClient } from '@angular/common/http';
import { Instance } from '../../core/entities';
import { HttpRequestService } from '../../core/services';
import { InstancesService } from './instances.service';

export class InstancesDemoService extends InstancesService {

    // #region 'Constructor'

    constructor(protected httpRequestService: HttpRequestService, private http: HttpClient) {
        super(httpRequestService);
    }

    // #endregion


    // #region 'Public Method'

    async getInstancesAsync(): Promise<Instance[]> {
        const instances = await this.getDemoDataWithFileName<Instance[]>('instances.json');
        return instances;
    }

    // #endregion


    // #region 'Private Methods'

    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/core/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }

    // #endregion
}
