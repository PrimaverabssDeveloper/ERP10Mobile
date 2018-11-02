import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService, LocaleService } from './core/services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authenticationService: AuthenticationService,
        private locale: LocaleService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            // start authentication
            this.authenticationService.authenticate();

            // defines locales
            this.locale.setSupportedLocales(['pt-PT', 'en-US', 'es-ES']);
            this.locale.setDefaultLocale('en-US');
            this.locale.setLocale('en-US');
        });
    }
}
