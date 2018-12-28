import { HttpRequestService } from '../../core/services';
import { Instance } from '../../core/entities';


export class InstancesService {

    // #region 'Constructor'

    constructor(protected httpRequestService: HttpRequestService) {
    }

    // #endregion


    // #region 'Public Method'

    async getInstancesAsync(): Promise<Instance[]> {
        let instances: Instance[] = null;

        try {
            instances = await this.httpRequestService.get<Instance[]>('app/instances');
        } catch (error) {
            console.log(error);
        }

        return instances;
    }

    // #endregion
}
