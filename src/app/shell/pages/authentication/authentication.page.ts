import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services';
import { Router } from '@angular/router';
import { AppSettings } from '../../../core/app-settings';
import { AlertController } from '@ionic/angular';

@Component({
    templateUrl: './authentication.page.html',
    styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {


    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private appSettings: AppSettings,
        private alertController: AlertController
    ) {
    }

    /**
    * Execute on page initialization.
    *
    * @memberof AuthenticationPage
    */
    async ngOnInit() {
        const isAuthenticated = await this.authenticationService.isAuthenticate();

        if (isAuthenticated) {
            this.router.navigate(['/shell/instances']);
        }
    }

    async loginAction() {

        if (this.appSettings.isMobilePlatform) {
            const isAuthenticated = await this.authenticationService.authenticate();
            if (isAuthenticated) {
                this.router.navigate(['/shell/instances']);
            }
        } else {
            const alert = await this.alertController.create({
                header: 'Authentication',
                message: 'The authentication can only be performed when the app is running on a mobile device. Starting in demo.',
                buttons: [{
                    text: 'ok',
                    handler: () => {
                        this.demoAction();
                    }
                }]
            });

            await alert.present();
        }
    }

    async demoAction() {
        this.authenticationService.authenticateAsDemo();
        this.router.navigate(['/shell/instances']);
    }
}
