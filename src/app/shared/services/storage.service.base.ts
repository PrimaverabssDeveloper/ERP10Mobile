
import { NativeStorage } from '@ionic-native/native-storage/ngx';

/**
 * Base service to store data.
 * Each module must implement the local storage service
 * and provide an unique module key throw the method 'getModuleKey'.
 * This way, no module will access/override the data from another module.
 *
 * @export
 * @abstract
 * @class StorageServiceBase
 */
export abstract class StorageServiceBase {

    // #region 'Constructor'

    constructor(protected nativeStorage: NativeStorage) {

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
    public async setData<T>(key: string, data: T) {
        if (!key) {
            throw new TypeError('The "key" parameter is empty');
        }

        if (!data) {
            throw new TypeError('The "data" parameter is empty');
        }

        const dataKey = this.buildDataKey(key);
        this.nativeStorage
            .setItem(dataKey, data)
            .then(
                (resolve) => {
                    console.log('stored');
                },
                (error) => {
                    console.log('err ' + error);
                }
            );
    }

    /**
     * Retrieves the data form the provided key.
     *
     * @template T
     * @param {string} key The data key.
     * @returns {Promise<T>}
     * @memberof StorageServiceBase
     */
    public async getData<T>(key: string): Promise<T> {
        const dataKey = this.buildDataKey(key);
        return new Promise<T>((resolve, error) => {
            this.nativeStorage
                .getItem(dataKey)
                .then(
                    data => {
                        resolve(data);
                    } ,
                    err => {
                        error(err);
                    }
                );
        });
    }

    /**
     * Removed the data for the provided key.
     *
     * @param {string} key The data key.
     * @memberof StorageServiceBase
     */
    async removeData(key: string) {
        const dataKey = this.buildDataKey(key);
        await this.nativeStorage.remove(dataKey);
    }

    // #endregion

    // #region 'Protected Abstract Methods'

    protected abstract getModuleKey(): string;

    // #endregion

    // #region 'Private Methods'

    private buildDataKey(dataKey: string) {
        if (this.getModuleKey === undefined) {
            throw new TypeError('The method "getModuleKey" is not implemented');
        }

        const moduleKey = this.getModuleKey();

        if (!moduleKey) {
            throw new TypeError('The method "getModuleKey" return an empty key');
        }

        return `${moduleKey}_${dataKey}`;
    }

    // #endregion
}
