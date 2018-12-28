import { Injectable } from '@angular/core';
import { StorageService, ModuleStorageServiceBase, InstanceService } from '../../core/services';


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

    constructor(protected storage: StorageService, protected instanceService: InstanceService) {
        super(storage, instanceService);
    }
    // #endregion

    // #region 'Protected Methods'

    protected getModuleKey(): string {
        return 'SALES';
    }

    // #endregion

}

