import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { CoreStorageService } from './core-storage.service';
import { AppSettings } from '../app-settings';

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

    private proofKey: ProofKey;
    private clientId: string;
    private redirectUri: string;
    private scope: string[];
    private responseType: string;
    private codeChallengeMethod: string;
    private grantType: string;
    private authenticationEndpoint: string;
    private requestTokenEndpoint: string;

    private authenticationResolve: (value?: boolean | PromiseLike<boolean>) => void;

    public isAuthenticateAsDemo = true;

    constructor(
        private http: HttpClient,
        private safariViewController: SafariViewController,
        private coreStorageService: CoreStorageService,
        private appSettings: AppSettings
    ) {

        this.clientId = authenticationSettings.clientId;
        this.redirectUri = 'com.primavera.v10://stg-identity.primaverabss.com/connect/cordova/com.primavera.v10/callback';
        this.scope = ['openid', 'profile', 'email', 'lithium-mobile', 'offline_access'];
        this.responseType = 'code';
        this.codeChallengeMethod = 'S256';
        this.grantType = 'authorization_code';
        this.authenticationEndpoint = this.appSettings.authenticationEndpoint;
        this.requestTokenEndpoint = this.appSettings.authenticationRequestTokenEndpoint;
    }

    async authenticate(): Promise<boolean> {
        (window as any).handleOpenURL = (url: string) => {
            const finalUrl = url.split(' ').join('%20');
            this.handleAuthenticationUrl(finalUrl);
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

    authenticateAsDemo() {
        this.isAuthenticateAsDemo = true;
    }

    async isAuthenticate(): Promise<boolean> {
        let isAuthenticated = false;

        if (this.isAuthenticateAsDemo) {
            isAuthenticated = true;
        } else {
            let sessionData: AuthenticationData;

            try {
                sessionData = await this.coreStorageService.getData<AuthenticationData>(AuthenticationService.STORAGE_SESSION_DATA_KEY);
            } catch (error) {
                isAuthenticated = false;
            }

            if (sessionData && new Date(sessionData.expirationDate) > (new Date()) ) {
                isAuthenticated = true;
            }
        }

        return new Promise<boolean>(
            (resolve) => {
                resolve(isAuthenticated);
            });
    }

    // async isAuthenticateAsDemo(): Promise<boolean> {
    //     let isAuthenticated: Boolean = false;

    //     try {
    //         const storageKey = AuthenticationService.STORAGE_SESSION_AUTHENTICATED_AS_DEMO;
    //         isAuthenticated = await this.coreStorageService.getData<Boolean>(storageKey);
    //     } catch (error) {
    //         isAuthenticated = false;
    //     }

    //     return new Promise<boolean>(
    //         (resolve) => {
    //             resolve(isAuthenticated.valueOf());
    //         });
    // }

    async endSession() {
        this.isAuthenticateAsDemo = false;

        // remove regular authentication session data
        return this.coreStorageService.removeData(AuthenticationService.STORAGE_SESSION_DATA_KEY);
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
        const body = new URLSearchParams();
        body.set('client_id', this.clientId);
        body.set('redirect_uri', this.redirectUri);
        body.set('code', code);
        body.set('code_verifier', this.proofKey.codeVerifier);
        body.set('grant_type', this.grantType);

        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            }
        };

        this.http
            .post(this.requestTokenEndpoint, body.toString(), options)
            .subscribe(res => {
                this.endAuthenticationProcess(res);
            });
    }

    private openBrowser(url: string) {
        this.safariViewController
            .isAvailable()
            .then((available: boolean) => {
                if (available) {
                    this.safariViewController.show(
                        {
                            url: url,
                            hidden: true
                        }
                    ).subscribe((result: any) => {
                        if (result.event === 'opened') {
                            console.log('Opened');
                        } else if (result.event === 'loaded') {
                            console.log('Loaded');
                        } else if (result.event === 'closed') {
                            console.log('Closed');
                        }
                    },
                        (error: any) => console.error(error)
                    );

                } else {
                    // use fallback browser, example InAppBrowser
                }
            }
            );
    }

    private async endAuthenticationProcess(data: any) {
        let authenticationData: AuthenticationData;
        const expirationData = new Date();
        expirationData.setSeconds(expirationData.getSeconds() + data.expires_in);

        authenticationData = {
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
    expirationDate: Date;
    accessToken: string;
    idToken: string;
    refreshToken: string;
    tokenType: string;
}
