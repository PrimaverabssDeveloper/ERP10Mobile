import { Injectable } from '@angular/core';
import { StorageService, ModuleStorageServiceBase, InstancesService } from '../../core/services';


/**
 * Provides exclusive storage to the 'Sales' module.
 *
 * @export
 * @class SalesStorageService
 * @extends {StorageServiceBase}
 */
@Injectable({
    providedIn: 'root',
})
export class SalesStorageService extends ModuleStorageServiceBase {

    // #region 'Constructor'

    constructor(protected storage: StorageService, protected instancesService: InstancesService) {
        super(storage, instancesService);
    }
    // #endregion

    // #region 'Protected Methods'

    protected getModuleKey(): string {
        return 'SALES';
    }

    // #endregion

}

