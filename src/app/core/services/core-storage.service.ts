import { Injectable } from '@angular/core';
import { ModuleStorageServiceBase } from './storage/module-storage.service.base';
import { StorageService } from './storage/storage.service';
import { InstancesService } from './instances.service';


/**
 * Provides exclusive storage to the 'Core' module.
 *
 * @export
 * @class CoreStorageService
 * @extends {StorageServiceBase}
 */
@Injectable({
    providedIn: 'root',
})
export class CoreStorageService extends ModuleStorageServiceBase {

    // #region 'Constructor'

    constructor(protected storage: StorageService, protected instancesService: InstancesService) {
        super(storage, instancesService);
    }
    // #endregion

    // #region 'Protected Methods'

    protected getModuleKey(): string {
        return 'CORE';
    }

    // #endregion

}

