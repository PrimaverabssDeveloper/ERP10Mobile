
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StorageService } from './storage.service';

/**
 * Native store service.
 * Provides storage on the mobile device native storage.
 *
 * @export
 * @class NativeStorageService
 * @implements {StorageService}
 */
export class NativeStorageService implements StorageService {

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
    public async setData<T>(key: string, data: T): Promise<any> {
        if (!key) {
            throw new TypeError('The "key" parameter is empty');
        }

        if (!data) {
            throw new TypeError('The "data" parameter is empty');
        }

        return this.nativeStorage.setItem(key, data);
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
        return new Promise<T>((resolve, error) => {
            this.nativeStorage
                .getItem(key)
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
    public async removeData(key: string): Promise<any> {
        await this.nativeStorage.remove(key);
    }

    // #endregion
}
