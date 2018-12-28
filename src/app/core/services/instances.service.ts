import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Instance, Module } from '../entities';
import { HttpRequestService } from './http-request.service';
import { StorageService } from './storage/storage.service';

/**
 * This service provides the available instances to the current user and the current instance selected by the user.
 *
 * @export
 * @class InstancesService
 */
@Injectable({
    providedIn: 'root',
})
export class InstancesService {

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

    constructor(private httpRequestService: HttpRequestService, private storage: StorageService) {
    }

    // #endregion

    // #region 'Public Method'

    async init(): Promise<any> {
        try {
            this._currentInstance = await this.retrieveCurrentInstanceFromStorageAsync();
        } catch (error) {
            console.log('No session storage');
        }
    }

    async getInstancesAsync(): Promise<Instance[]> {
        let instances: Instance[] = null;

        try {
            instances = await this.httpRequestService.get<Instance[]>('app/instances');
        } catch (error) {
            console.log(error);
        }

        return instances;
    }

    // getInstanceModules(): Observable<Module[]> {
    //     const partialUrl = `app/instances/${this.currentInstance.subscriptionAlias}/modules`;
    //     return this.httpRequestService.get<Module[]>(partialUrl);
    // }

    // async getModuleSummary(module: Module): Promise<any> {
    //     const accountKey = this.currentInstance.accountKey;
    //     const subsAlias = this.currentInstance.subscriptionAlias;

    //     const partialUrl = `${accountKey}/${subsAlias}/${module.name}`;
    //     let summary: any = null;

    //     try {
    //         summary = await this.httpRequestService.get<any>(partialUrl);
    //     } catch (error) {
    //         console.log(error);
    //     }

    //     return summary;
    // }

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

    // #endregion
}
