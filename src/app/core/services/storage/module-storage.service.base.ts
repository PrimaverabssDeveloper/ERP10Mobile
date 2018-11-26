
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StorageService } from './storage.service';
import { InstancesService } from '../instances.service';

/**
 * Base service to store data from modules.
 * Each module must implement the local storage service
 * and provide an unique module key throw the method 'getModuleKey'.
 * This way, no module will access/override the data from another module.
 *
 * @export
 * @abstract
 * @class ModuleStorageServiceBase
 */
export abstract class ModuleStorageServiceBase {

    // #region 'Constructor'

    constructor(protected storage: StorageService, protected instancesService: InstancesService) {
    }

    // #endregion

    // #region 'Public Methods'

    /**
     * Stored any data with the provided data key.
     *
     * @template T
     * @param {string} key The data key. This key will be used to retrive the data later.
     * @param {T} data The data to store.
     * @memberof StorageServiceBase
     */
    public async setData<T>(key: string, data: T, instanceDependent?: boolean): Promise<any> {
        const dataKey = this.buildDataKey(key, instanceDependent);
        return this.storage.setData(dataKey, data);
    }

    /**
     * Retrieves the data form the provided key.
     *
     * @template T
     * @param {string} key The data key.
     * @returns {Promise<T>}
     * @memberof StorageServiceBase
     */
    public async getData<T>(key: string, instanceDependent?: boolean): Promise<T> {
        const dataKey = this.buildDataKey(key, instanceDependent);
        return this.storage.getData<T>(dataKey);
    }

    /**
     * Removed the data for the provided key.
     *
     * @param {string} key The data key.
     * @memberof StorageServiceBase
     */
    async removeData(key: string, instanceDependent?: boolean): Promise<any> {
        const dataKey = this.buildDataKey(key, instanceDependent);
        return this.storage.removeData(dataKey);
    }

    // #endregion

    // #region 'Protected Abstract Methods'

    protected abstract getModuleKey(): string;

    // #endregion

    // #region 'Private Methods'

    private buildDataKey(dataKey: string, instanceDependent: boolean) {
        if (this.getModuleKey === undefined) {
            throw new TypeError('The method "getModuleKey" is not implemented');
        }

        const moduleKey = this.getModuleKey();

        if (!moduleKey) {
            throw new TypeError('The method "getModuleKey" return an empty key');
        }

        if (instanceDependent) {
            const instanceKey = this.instancesService.currentInstance.key;
            return `${instanceKey}_${moduleKey}_${dataKey}`;
        } else {
            return `${moduleKey}_${dataKey}`;
        }
    }

    // #endregion
}
