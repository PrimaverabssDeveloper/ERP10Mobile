import { Injectable } from '@angular/core';

import Auth0Cordova from '@auth0/cordova';

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
            domain: 'stg-identity.primaverabss.com/connect', // '{YOUR_AUTH0_DOMAIN}',
            clientId: '',
            packageIdentifier: 'com.primavera.v10', //  '{WIDGET_ID_IN_CONFIG_XML}'
        });

        const options = {
            scope: 'openid profile email lithium-mobile offline_access',
            responseType: 'code token',
            redirectUri: 'com.primavera.v10://' // 'primaverav10mobile://'
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
