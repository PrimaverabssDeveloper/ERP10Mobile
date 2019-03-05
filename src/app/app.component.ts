import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService, LocaleService, InstanceService } from './core/services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    appReady: boolean;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private instanceService: InstanceService,
        private authenticationService: AuthenticationService,
        private locale: LocaleService
    ) {
        this.initializeApp();
    }

    async initializeApp() {

        await this.platform.ready();
        await this.instanceService.init();
        await this.authenticationService.init();

        this.statusBar.styleDefault();
        this.splashScreen.hide();

        // window.navigator.language; TBD

        // defines locales
        this.locale.setSupportedLocales(['pt-PT', 'en-US', 'es-ES']);
        this.locale.setDefaultLocale('en-US');
        this.locale.setLocale('en-US');

        this.appReady = true;
    }

    // initializeApp() {

    //     this.platform.ready().then(() => {
    //         this.statusBar.styleDefault();
    //         this.splashScreen.hide();

    //         // call the native storage to get it ready
    //         if (this.platform.is('cordova')) {
    //             this.nativeStorage.keys();
    //         }

    //         // // start authentication
    //         // this.authenticationService.authenticate();
    //         // this.authenticationService.is

    //         // defines locales
    //         this.locale.setSupportedLocales(['pt-PT', 'en-US', 'es-ES']);
    //         this.locale.setDefaultLocale('en-US');
    //         this.locale.setLocale('en-US');

    //         // this.appReady = true;
    //     });
    // }
}
