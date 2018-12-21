import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { HttpClient } from '@angular/common/http';
import { InstancesService } from './instances.service';
import { AppSettings } from '../app-settings';


/**
 * Service to be used to perform all http request to the API that are ERP Instance dependent.
 *
 * @export
 * @class InstanceHttpRequestService
 * @extends {HttpRequestService}
 */
@Injectable({
    providedIn: 'root',
})
export class InstanceHttpRequestService extends HttpRequestService {

    // #region 'Constructor'

    /**
     *Creates an instance of InstanceHttpRequestService.
     * @param {HttpClient} http
     * @param {AppSettings} appSettings
     * @param {InstancesService} instanceService
     * @memberof InstanceHttpRequestService
     */
    constructor(protected http: HttpClient, protected appSettings: AppSettings, private instanceService: InstancesService) {
        super(http, appSettings);
    }

    // #endregion

    // #region 'Protected Methods'

    /**
     * Create the final url with the correct format, 'account key', 'subscription alias' and server endpoint.
     *
     * @protected
     * @param {string} partialUrl
     * @returns {string}
     * @memberof InstanceHttpRequestService
     */
    protected buildFinalUrl(partialUrl: string): string {

        const subsAlias = this.instanceService.currentInstance.subscriptionAlias;
        const accountKey = this.instanceService.currentInstance.accountKey;

        let finalPartialUrl = this.addHeadSlashToUrl(partialUrl);
        finalPartialUrl = `${accountKey}/${subsAlias}${finalPartialUrl}`;

        // build the remain endpoint with the.
        const finalUrl = super.buildFinalUrl(finalPartialUrl);

        return finalUrl;
    }

    // #endregion
}
