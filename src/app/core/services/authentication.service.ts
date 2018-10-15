import { Injectable } from '@angular/core';

import Auth0Cordova from '@auth0/cordova';

const authenticationSettings = require('../../../authentication-settings.json');

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    authenticate() {
        // Redirect back to app after authenticating
        (window as any).handleOpenURL = (url: string) => {
            Auth0Cordova.onRedirectUri(url);
        };

        // https://github.com/auth0/auth0-cordova

        const auth0 = new Auth0Cordova({
            domain: 'stg-identity.primaverabss.com/connect',
            clientId: authenticationSettings.clientId,
            packageIdentifier: 'com.primavera.v10',
        });

        const options = {
            scope: 'openid profile email lithium-mobile',
            responseType: 'code token'
        };

        auth0.authorize(options, function (err, result) {
            if (err) {
                console.log('Error authenticating');
            } else {
                console.log('Authentication with success');
            }
        });
    }
}
