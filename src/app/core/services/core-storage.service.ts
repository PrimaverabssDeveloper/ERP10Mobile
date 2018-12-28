import { Injectable } from '@angular/core';
import { ModuleStorageServiceBase } from './storage/module-storage.service.base';
import { StorageService } from './storage/storage.service';
import { InstanceService } from './instance.service';


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

    constructor(protected storage: StorageService, protected instanceService: InstanceService) {
        super(storage, instanceService);
    }
    // #endregion

    // #region 'Protected Methods'

    protected getModuleKey(): string {
        return 'CORE';
    }

    // #endregion

}

