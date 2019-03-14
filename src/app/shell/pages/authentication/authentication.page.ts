import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService, StorageService, InstanceService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../core/app-settings';
import { AlertController, NavController } from '@ionic/angular';
import { InstancesService, InstancesServiceProvider } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './authentication.page.html',
    styleUrls: ['./authentication.page.scss'],
    providers: [InstancesServiceProvider]
})
export class AuthenticationPage implements OnInit {


    constructor(
        private authenticationService: AuthenticationService,
        private instancesService: InstancesService,
        private instanceService: InstanceService,
        private translateService: TranslateService,
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
            await this.endSession();
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

    private async goToInstanceSelectorPage() {

        const instances = await this.instancesService.getInstancesAsync();

        // no instances available
        if (!instances || instances.length === 0) {
            const message = await this.translateService.get('SHELL.AUTHENTICATION.NO_SUBSCRIPTION_MESSAGE').toPromise();
            const alert = await this.alertController.create({
                message: message,
                buttons: [{
                    text: 'ok',
                    handler: () => {
                        this.demoAction();
                    }
                }]
            });

            await alert.present();
            await this.endSession();

            return;
        }

        // only one instance available.
        // go directly to the dashboard
        if (instances.length === 1) {
            await this.instanceService.setCurrentInstanceAsync(instances[0]);
            this.zone.run(() => this.navController.navigateRoot('/shell/dashboard', { replaceUrl: true}));
            return;
        }

        // more than one instance availabe. Go to the instance selector
        const extras = {
            replaceUrl: true,
            queryParams: {
                instances: JSON.stringify(instances),
            }
        };

        this.zone.run(() => this.navController.navigateRoot(['/shell/instances'], extras));
    }

    private async endSession() {
        await this.storageService.clear();
        await this.authenticationService.endSession();
    }
}
