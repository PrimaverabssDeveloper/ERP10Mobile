import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services';

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

    @Input() contentId: string;

    constructor(
        private translateService: TranslateService,
        private router: Router,
        private alertController: AlertController
    ) {}


    /**
     * Show's logout confirmation window.
     *
     * @memberof DashboardPage
     */
    async logoutAction() {
        const header = await this.translateService.get('SHARED.SIDE_MENU_COMPONENT.ALERT_LOGOUT_HEADER').toPromise();
        const message = await this.translateService.get('SHARED.SIDE_MENU_COMPONENT.ALERT_LOGOUT_MESSAGE').toPromise();

        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: () => this.logout()
                }
            ]
        });

        await alert.present();
    }

    changeInstancesAction() {
        this.router.navigate(['/shell/instances']);
    }

    private async logout() {
        // // If the router was used to navigate, the app page stack was not clean
        // window.location.href = '/shell/authentication?logout=true';
        this.router.navigate(
            ['/authentication'],
            {
                replaceUrl: true,
                queryParams: {
                    'logout': true
                }
            }
        );
    }
}
