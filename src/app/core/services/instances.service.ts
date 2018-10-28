import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Instance, Module } from '../entities';
import { HttpRequestService } from './http-request.service';

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
    _currentInstance: Instance;
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
        }

        return this._currentInstance;
    }

    /**
     * Set the current selected instance.
     *
     * @memberof InstancesService
     */
    set currentInstance(value: Instance) {
        this._currentInstance = value;
    }

    // #endregion

    // #region 'Constructor'

    constructor(private httpRequestService: HttpRequestService) {
    }

    // #endregion

    // #region 'Public Method'

    getInstances(): Observable<Instance[]> {
        return this.httpRequestService.get<Instance[]>('app/instances');
    }

    getInstanceModules(): Observable<Module[]> {
        const partialUrl = `app/instances/${this.currentInstance.key}/modules`;
        return this.httpRequestService.get<Module[]>(partialUrl);
    }

    // #endregion
}
