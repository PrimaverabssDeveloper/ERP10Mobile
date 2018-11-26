import { StorageService } from './storage.service';

/**
 * Local store service.
 * Promvides storage on the browser 'localStorage'.
 *
 * @export
 * @class LocalStorageService
 * @implements {StorageService}
 */
export class LocalStorageService implements StorageService {

    // #region 'Constructor'

    constructor() {
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

        return new Promise((result, reject) => {

            if (!key) {
                reject('The "key" parameter is empty');
                return;
            }

            if (!data) {
                reject('The "data" parameter is empty');
                return;
            }

            const dataToStore = JSON.stringify(data);
            localStorage.setItem(key, dataToStore);
            result();
        });
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
        return new Promise<T>((result, reject) => {

            if (!key) {
                reject('The "key" parameter is empty');
                return;
            }

            const data = localStorage.getItem(key);
            let dataObj: T = null;

            if (data) {
                dataObj = JSON.parse(data);
            }

            result(dataObj);
        });
    }

    /**
     * Removed the data for the provided key.
     *
     * @param {string} key The data key.
     * @memberof StorageServiceBase
     */
    public async removeData(key: string): Promise<any> {
        return new Promise((result, reject) => {

            if (!key) {
                reject('The "key" parameter is empty');
                return;
            }

            localStorage.removeItem(key);

            result();
        });
    }

    // #endregion
}
