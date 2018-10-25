import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { HttpClient } from '@angular/common/http';
import { InstancesService } from './instances.service';


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

    // #region 'Private Properties'

    private get instanceKey(): string {
        return this.instanceService.currentInstance.key;
    }

    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of InstanceHttpRequestService.
     * @param {HttpClient} http
     * @param {InstancesService} instanceService
     * @memberof InstanceHttpRequestService
     */
    constructor(protected http: HttpClient, private instanceService: InstancesService) {
        super(http);
    }
    // #endregion

    // #region 'Protected Methods'

    /**
     * Create the final url with the correct format, instance key and server endpoint.
     *
     * @protected
     * @param {string} partialUrl
     * @returns {string}
     * @memberof InstanceHttpRequestService
     */
    protected buildFinalUrl(partialUrl: string): string {
        let finalPartialUrl = this.addHeadSlashToUrl(partialUrl);
        finalPartialUrl = `${this.instanceKey}${finalPartialUrl}`;

        // build the remain endpoint with the.
        const finalUrl = super.buildFinalUrl(finalPartialUrl);

        return finalUrl;
    }

    // #endregion
}
