import { Injectable } from '@angular/core';

import { StorageServiceBase } from '../../shared/services';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


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
export class CoreStorageService extends StorageServiceBase {

    // #region 'Constructor'

    constructor(protected nativeStorage: NativeStorage) {
        super(nativeStorage);
    }
    // #endregion

    // #region 'Protected Methods'

    protected getModuleKey(): string {
        return 'CORE';
    }

    // #endregion

}

