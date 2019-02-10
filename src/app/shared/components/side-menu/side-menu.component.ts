import { Component, Input, OnInit, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService, ModulesService } from '../../../core/services';
import { ModuleDefinition } from '../../../core/entities';

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

    @Input() contentId: string;

    modulesDefsWithSettings: ModuleDefinition[];

    constructor(
        private translateService: TranslateService,
        private zone: NgZone,
        private alertController: AlertController,
        private navController: NavController,
        private modulesService: ModulesService
    ) {}

    /**
    * Execute on page initialization.
    *
    * @memberof SideMenuComponent
    */
    async ngOnInit() {
        const modulesDefinitions = await this.modulesService.getAvailabeModulesDefinitions();
        this.modulesDefsWithSettings = modulesDefinitions.filter(m => m.settings && m.settings.hasSettings);
    }


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
                    handler: () => this.zone.run(() => this.logout())
                }
            ]
        });

        await alert.present();
    }

    async changeInstancesAction() {
        this.navController.navigateBack('/shell/instances', { replaceUrl: true});
    }

    private async logout() {
        this.navController.navigateBack(
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
