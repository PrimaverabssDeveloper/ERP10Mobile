import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { CoreStorageService } from './core-storage.service';
import { AppSettings } from '../app-settings';
import { HTTP } from '@ionic-native/http/ngx';

const authenticationSettings = require('../../../authentication-settings.json');
const crypto = require('crypto');

/**
 * Handle authentication.
 *
 * @export
 * @class AuthenticationService
 */
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    private static readonly STORAGE_SESSION_DATA_KEY = 'STORAGE_SESSION_DATA_KEY';

    private userHasLoggedOnIdentity: boolean;
    private proofKey: ProofKey;
    private clientId: string;
    private redirectUri: string;
    private scope: string[];
    private responseType: string;
    private codeChallengeMethod: string;
    private grantType: string;
    private authenticationEndpoint: string;
    private requestTokenEndpoint: string;
    private endSessionEndpoint: string;

    private authenticationResolve: (value?: boolean | PromiseLike<boolean>) => void;

    sessionData: AuthenticationData;

    get isAuthenticateAsDemo(): boolean {
        return this.sessionData && this.sessionData.isDemo;
    }

    get accessToken(): string {
        if (this.sessionData) {
            return this.sessionData.accessToken;
        } else {
            return null;
        }
    }

    constructor(
        private http: HTTP,
        private safariViewController: SafariViewController,
        private coreStorageService: CoreStorageService,
        private appSettings: AppSettings
    ) {

        this.clientId = authenticationSettings.clientId;
        this.redirectUri = 'com.primavera.v10://identity.primaverabss.com/connect/cordova/com.primavera.v10/callback';
        this.scope = ['openid', 'profile', 'email', 'lithium-mobile', 'offline_access'];
        this.responseType = 'code';
        this.codeChallengeMethod = 'S256';
        this.grantType = 'authorization_code';
        this.authenticationEndpoint = this.appSettings.authenticationEndpoint;
        this.requestTokenEndpoint = this.appSettings.authenticationRequestTokenEndpoint;
        this.endSessionEndpoint = this.appSettings.authenticationEndSessionEndpoint;
    }

    async init(): Promise<any> {
        try {
            const sessionData = await this.coreStorageService.getData<AuthenticationData>(AuthenticationService.STORAGE_SESSION_DATA_KEY);
            this.sessionData = sessionData;

        } catch (error) {
            console.log('No session storage');
            this.sessionData = null;
        }
    }

    async authenticate(): Promise<boolean> {
        (window as any).handleOpenURL = (url: string) => {
            const finalUrl = url.split(' ').join('%20');
            this.userHasLoggedOnIdentity = true;
            this.handleAuthenticationUrl(finalUrl);

            try {
                this.safariViewController.hide();
            } catch (error) {
                console.log(error);
            }
        };

        this.proofKey = this.generateProofKey();

        const options = {
            clientId: this.clientId,
            scope: this.scope,
            responseType: this.responseType,
            codeChallengeMethod: this.codeChallengeMethod,
            codeChallenge: this.proofKey.codeChallange,
            redirectUri: this.redirectUri
        };

        const authUrl = this.generateAuthenticationUrl(this.authenticationEndpoint, options);
        this.openBrowser(authUrl);

        return new Promise<boolean>((resolve) => {
            this.authenticationResolve = resolve;
        });
    }

    async authenticateAsDemoAsync(): Promise<any> {
        const authenticationData = {
            isDemo: true,
            accessToken: null,
            idToken: null,
            refreshToken: null,
            tokenType: null,
            expirationDate: null
        };

        this.sessionData = authenticationData;
        await this.coreStorageService.setData<AuthenticationData>(AuthenticationService.STORAGE_SESSION_DATA_KEY, authenticationData);
    }

    async isAuthenticate(): Promise<boolean> {
        let isAuthenticated = false;

        if (this.isAuthenticateAsDemo) {
            isAuthenticated = true;
        } else {
            let sessionData: AuthenticationData;

            try {
                sessionData = await this.coreStorageService.getData<AuthenticationData>(AuthenticationService.STORAGE_SESSION_DATA_KEY);
                this.sessionData = sessionData;
            } catch (error) {
                isAuthenticated = false;
            }

            if (sessionData && new Date(sessionData.expirationDate) > (new Date())) {
                isAuthenticated = true;
            }
        }

        return new Promise<boolean>(
            (resolve) => {
                resolve(isAuthenticated);
            });
    }

    async endSession(): Promise<any> {

        if (!this.sessionData) {
            return;
        }

        // the demo authentication dont need to remove session from browser
        if (!this.isAuthenticateAsDemo) {

            // end the browser session
            const endSessionUrl = this.generateLogoutUrl(this.endSessionEndpoint, this.sessionData.idToken, this.redirectUri);
            (window as any).handleOpenURL = (url: string) => {
                console.log('logout performed with success');
            };

            try {
                await this.safariViewController.show({
                    url: endSessionUrl,
                    hidden: true,
                    animated: false
                }).toPromise();
            } catch (error) {
                console.log(error);
            }
        }

        // remove regular authentication session data
        await this.coreStorageService.removeData(AuthenticationService.STORAGE_SESSION_DATA_KEY);

        this.sessionData = null;
    }

    private handleAuthenticationUrl(url: string) {
        const urlQueryString = url.split('?')[1];
        const params = new URLSearchParams(urlQueryString);
        const error = params.get('error');

        if (error) {
            this.authenticationResolve(false);
            return;
        }

        const code = params.get('code');

        const body = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            code: code,
            code_verifier: this.proofKey.codeVerifier,
            grant_type: this.grantType
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        };

        this.http
            .post(this.requestTokenEndpoint, body, headers)
            .then(res => {
                const data = JSON.parse(res.data);
                this.endAuthenticationProcess(data);
            })
            .catch(err => console.log(err));
    }

    private openBrowser(url: string) {

        this.safariViewController
            .show({ url: url })
            .subscribe((result: any) => {
                if (result.event === 'opened') {
                    console.log('Opened');
                } else if (result.event === 'loaded') {
                    console.log('Loaded');
                } else if (result.event === 'closed') {
                    console.log('Closed');
                    setTimeout(() => {
                        if (!this.userHasLoggedOnIdentity) {
                            this.authenticationResolve(false);
                        }
                    }, 500);
                }
            },
                (error: any) => console.error(error)
            );
    }

    private async endAuthenticationProcess(data: any) {
        let authenticationData: AuthenticationData;
        const expirationData = new Date();
        expirationData.setSeconds(expirationData.getSeconds() + data.expires_in);

        authenticationData = {
            isDemo: false,
            accessToken: data.access_token,
            idToken: data.id_token,
            refreshToken: data.refresh_token,
            tokenType: data.token_type,
            expirationDate: expirationData
        };

        this.coreStorageService
            .setData<AuthenticationData>(AuthenticationService.STORAGE_SESSION_DATA_KEY, authenticationData)
            .then(
                (resolve) => {
                    console.log('stored');
                    this.sessionData = authenticationData;
                    this.authenticationResolve(true);
                },
                (error) => {
                    console.log('err ' + error);
                    this.authenticationResolve(false);
                }
            );
    }

    private generateAuthenticationUrl(requestTokenEndpoint: string, params: {
        clientId: string;
        scope: string[];
        responseType: string;
        // state: string;
        codeChallengeMethod: string;
        codeChallenge: string;
        redirectUri: string;
    }): string {

        const urlParts: string[] = [];
        urlParts.push(`${requestTokenEndpoint}?`);
        urlParts.push(`client_id=${params.clientId}&`);
        urlParts.push(`scope=${encodeURIComponent(params.scope.join(' '))}&`);
        urlParts.push(`response_type=${params.responseType}&`);
        // urlParts.push(`state=${options.state}&`);
        urlParts.push(`code_challenge_method=${params.codeChallengeMethod}&`);
        urlParts.push(`code_challenge=${params.codeChallenge}&`);
        urlParts.push(`redirect_uri=${encodeURIComponent(params.redirectUri)}`);

        return urlParts.join('');
    }

    private generateLogoutUrl(endSessionEndpoint: string, idToken: string, redirectUri: string): string {
        return `${endSessionEndpoint}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(this.redirectUri)}`;
    }

    private base64UrlSafeEncode(value: Buffer) {
        return value.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    private generateProofKey(): ProofKey {
        const codeVerifier = this.base64UrlSafeEncode(crypto.randomBytes(32));
        const codeChallenge = this.base64UrlSafeEncode(crypto.createHash('sha256').update(codeVerifier).digest());

        return {
            codeVerifier: codeVerifier,
            codeChallange: codeChallenge
        };
    }

    private generateState(): string {
        return this.base64UrlSafeEncode(crypto.randomBytes(32));
    }
}

interface ProofKey {
    codeVerifier: string;
    codeChallange: string;
}

interface AuthenticationData {
    isDemo: boolean;
    expirationDate: Date;
    accessToken: string;
    idToken: string;
    refreshToken: string;
    tokenType: string;
}
