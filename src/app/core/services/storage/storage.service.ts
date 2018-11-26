
/**
 * Abstract class that must be implemented for all the storage providers.
 *
 * @export
 * @abstract
 * @class StorageService
 */
export abstract class StorageService {

    /**
     * Stored any data with the provided data key.
     *
     * @abstract
     * @template T
     * @param {string} key
     * @param {T} data
     * @param {boolean} [instanceDependent]
     * @memberof StorageService
     */
    public abstract async setData<T>(key: string, data: T, instanceDependent?: boolean);

    /**
     * Retrieves the data form the provided key.
     *
     * @abstract
     * @template T
     * @param {string} key
     * @param {boolean} [instanceDependent]
     * @returns {Promise<T>}
     * @memberof StorageService
     */
    public abstract async getData<T>(key: string, instanceDependent?: boolean): Promise<T>;

    /**
     * Removed the data for the provided key.
     *
     * @abstract
     * @param {string} key
     * @param {boolean} [instanceDependent]
     * @returns {Promise<any>}
     * @memberof StorageService
     */
    public abstract async removeData(key: string, instanceDependent?: boolean): Promise<any>;
}
