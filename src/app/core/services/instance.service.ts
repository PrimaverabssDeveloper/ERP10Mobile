import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Instance, Module } from '../entities';
import { HttpRequestService } from './http-request.service';
import { StorageService } from './storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

/**
 * This service provides the current instance selected by the user.
 *
 * @export
 * @class InstanceService
 */
@Injectable({
    providedIn: 'root',
})
export class InstanceService {

    // #region 'Private Fields'
    private _currentInstance: Instance;
    // #endregion

    // #region 'Public Properties'

    /**
     * Get the current selected instance.
     *
     * @type {Instance}
     * @memberof InstancesService
     */
    get currentInstance(): Instance {
        if (!this._currentInstance) {
            // get the selected instance from the storage
            return {
                subscriptionAlias: '100001-001',
                accountKey: '100001',
                id: '1',
                description: 'Primavera',
                modules: []
            };
        }

        return this._currentInstance;
    }

    // /**
    //  * Set the current selected instance.
    //  *
    //  * @memberof InstancesService
    //  */
    // set currentInstance(value: Instance) {
    //     this._currentInstance = value;
    // }

    // #endregion

    // #region 'Constructor'

    constructor(
        private httpRequestService: HttpRequestService,
        private storage: StorageService,
        private http: HttpClient
        ) {
    }

    // #endregion

    // #region 'Public Method'

    async init(): Promise<any> {
        try {
            const currentInstance = await this.retrieveCurrentInstanceFromStorageAsync();
            this._currentInstance = currentInstance;
        } catch (error) {
            console.log('No session storage');
        }
    }

    /**
     * Defines the current instance.
     *
     * @param {Instance} instance
     * @memberof InstancesService
     */
    async setCurrentInstanceAsync(instance: Instance) {
        this._currentInstance = instance;
        await this.storeCurrentInstanceAsync(instance);
    }

    // #endregion

    // #region 'Private Methods'

    private async storeCurrentInstanceAsync(instance: Instance) {
        await this.storage.setData('CURRENT_INSTANCE', instance);
    }

    private async retrieveCurrentInstanceFromStorageAsync(): Promise<Instance> {
        const instance = await this.storage.getData<Instance>('CURRENT_INSTANCE');
        return instance;
    }

    private async getInstancesFromServerAsync(): Promise<Instance[]> {
        let instances: Instance[] = null;

        try {
            instances = await this.httpRequestService.get<Instance[]>('app/instances');
        } catch (error) {
            console.log(error);
        }

        return instances;
    }

    // #endregion
}
