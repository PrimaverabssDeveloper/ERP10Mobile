import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService, StorageService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../core/app-settings';
import { AlertController, NavController } from '@ionic/angular';

@Component({
    templateUrl: './authentication.page.html',
    styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {


    constructor(
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private appSettings: AppSettings,
        private alertController: AlertController,
        private storageService: StorageService,
        private zone: NgZone,
        private navController: NavController
    ) {
    }

    /**
    * Execute on page initialization.
    *
    * @memberof AuthenticationPage
    */
    async ngOnInit() {

        const logout = this.route.snapshot.queryParams['logout'];
        if (logout) {
            await this.storageService.clear();
            await this.authenticationService.endSession();
        }

        const isAuthenticated = await this.authenticationService.isAuthenticate();

        if (isAuthenticated) {
            this.goToInstanceSelectorPage();
        }
    }

    async loginAction() {

        if (this.appSettings.isMobilePlatform) {
            const isAuthenticated = await this.authenticationService.authenticate();
            if (isAuthenticated) {
                this.goToInstanceSelectorPage();
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
        await this.authenticationService.authenticateAsDemoAsync();
        this.goToInstanceSelectorPage();
    }

    private goToInstanceSelectorPage() {
        // (window as any).location = '/shell/instances';

        this.zone.run(() => this.navController.navigateForward(['/shell/instances'], { replaceUrl: true}));
    }
}
