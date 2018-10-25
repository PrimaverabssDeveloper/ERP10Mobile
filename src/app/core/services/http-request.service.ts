import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';


/**
 * Service to be used to perform all http request to the API.
 *
 * @export
 * @class HttpRequestService
 */
@Injectable({
    providedIn: 'root',
})
export class HttpRequestService {

    // #region 'Private Fields'

    private _baseEndpoint: string;

    // #endregion

    // #region 'Private Properties'
    private get baseEndpoint(): string {
        if (!this._baseEndpoint) {
            // get the endpoint from the environment config class.
            const environmentBaseEndpoint = environment.apiEndpoint;

            // removes the tail slash from the endpoint
            this._baseEndpoint = this.removeTailSlashFromUrl(environmentBaseEndpoint);
        }

        return this._baseEndpoint;
    }

    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of HttpRequestBaseService.
     * @param {HttpClient} http
     */
    constructor(protected http: HttpClient) {
    }

    // #endregion

    // #region 'Public Methods'

    /**
     * Performs HTTP Requests with method GET.
     *
     * @template T
     * @param {string} partialUrl
     * @returns {Observable<T>}
     */
    public get<T>(partialUrl: string): Observable<T> {
        const finalUrl = this.buildFinalUrl(partialUrl);
        return this.http.get<T>(finalUrl);
    }

    /**
     * Performs HTTP Requests with method POST.
     *
     * @template T
     * @param {string} partialUrl
     * @param {*} [body]
     * @returns {Observable<T>}
     */
    public post<T>(partialUrl: string, body?: any): Observable<T> {
        const finalUrl = this.buildFinalUrl(partialUrl);
        return this.http.post<T>(finalUrl, body);
    }

    /**
     * Performs HTTP Requests with method PUT.
     *
     * @template T
     * @param {string} partialUrl
     * @param {*} [body]
     * @returns {Observable<T>}
     */
    public put<T>(partialUrl: string, body?: any): Observable<T> {
        const finalUrl = this.buildFinalUrl(partialUrl);
        return this.http.put<T>(finalUrl, body);
    }

    /**
     * Performs HTTP Requests with method DELETE.
     *
     * @param {string} partialUrl
     * @returns {Observable<any>}
     * @memberof HttpRequestBaseService
     */
    public delete(partialUrl: string): Observable<any> {
        const finalUrl = this.buildFinalUrl(partialUrl);
        return this.http.delete(finalUrl);
    }

    // #endregion

    // #region 'Protected Methods'

    /**
     * Create the final url with the correct format and server endpoint.
     *
     * @protected
     * @param {string} partialUrl
     * @returns {string}
     * @memberof HttpRequestService
     */
    protected buildFinalUrl(partialUrl: string): string {
        const finalPartialUrl = this.addHeadSlashToUrl(partialUrl);
        return `${this.baseEndpoint}${finalPartialUrl}`;
    }

    /**
     * Add an slash '/' to the head of the partial url in case it don't have it.
     *
     * @protected
     * @param {string} partialUrl
     * @returns {string}
     * @memberof HttpRequestService
     */
    protected addHeadSlashToUrl(partialUrl: string): string {
        if (!partialUrl) {
            return partialUrl;
        }

        if (partialUrl[0] !== '/') {
            const slashedUrl = `/${partialUrl}`;
            return slashedUrl;
        }

        return partialUrl;
    }

    // #endregion

    // #region 'Private Methods'

    private removeTailSlashFromUrl(partialUrl: string): string {
        if (!partialUrl) {
            return partialUrl;
        }

        if (partialUrl[partialUrl.length - 1] === '/') {
            const slashlessUrl = partialUrl.slice(0, partialUrl.length - 1);
            return slashlessUrl;
        }

        return partialUrl;
    }

    // #endregion

}
