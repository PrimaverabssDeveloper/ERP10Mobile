import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';

/**
 * Provide the app Settings.
 *
 * @export
 * @class AppSettings
 */
@Injectable({
    providedIn: 'root',
})
export class AppSettings {

    // #region 'Private Properties'

    private _isMobilePlatform: boolean;
    private _apiEndpoint: string;
    private _authenticationEndpoint: string;
    private _authenticationRequestTokenEndpoint: string;

    // #endregion

    // #region 'Public Properties'

    /**
     * Indicate if the app is running on a mobile device.
     * If the value is 'true', the app is running on a mobile device,
     * otherwise, is running on a web browser.
     *
     * @readonly
     * @type {boolean}
     * @memberof AppSettings
     */
    public get isMobilePlatform(): boolean {
        return this._isMobilePlatform;
    }

    /**
     * Provides the api endpoint
     * defined on the 'environment' file.
     *
     * @readonly
     * @type {string}
     * @memberof AppSettings
     */
    public get apiEndpoint(): string {
        return this._apiEndpoint;
    }

    /**
     * Provides the oauth authentication endpoint
     * defined on the 'environment' file.
     *
     * @readonly
     * @type {string}
     * @memberof AppSettings
     */
    public get authenticationEndpoint(): string {
        return this._authenticationEndpoint;
    }

    /**
     * Provides the request token endpoint
     * to get the authentication token
     * defined on the 'environment' file.
     *
     * @readonly
     * @type {string}
     * @memberof AppSettings
     */
    public get authenticationRequestTokenEndpoint(): string {
        return this._authenticationRequestTokenEndpoint;
    }

    // #endregion

    // #region 'Constructor'

    constructor(private platform: Platform) {
        this._isMobilePlatform = this.platform.is('cordova');
        this._apiEndpoint = environment.apiEndpoint;
        this._authenticationEndpoint = environment.authentication.endpoint;
        this._authenticationRequestTokenEndpoint = environment.authentication.requestTokenEndpoint;
    }

    // #endregion
}
