import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesServiceProvider, HumanResourcesService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

/**
 * Settings for the sales module.
 *
 * @export
 * @class SalesSettingsPage
 * @extends {PageBase}
 * @implements {OnInit}
 */
@Component({
    templateUrl: 'hr-settings.page.html',
    styleUrls: [
        'hr-settings.page.scss',
        '../../../shared/styles/settings.scss'
    ],
    providers: [HumanResourcesServiceProvider]
})
export class HrSettingsPage extends PageBase implements OnInit {

    // #region 'Private Properties'
    _passwordEnabled: boolean;
    // #endregion


    // #region 'Public Properties'
    get passwordEnabled(): boolean {
        return this._passwordEnabled;
    }

    set passwordEnabled(value: boolean) {
        this._passwordEnabled = value;
        if (value) {
            this.enablePassword();
        } else {
            this.disablePassword();
        }
    }
    // #endregion

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private translateService: TranslateService,
        private humanResourcesService: HumanResourcesService,
        private alertController: AlertController
    ) {
        super(loadingController, location, menuController);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof SalesSettingsPage
    */
    async ngOnInit() {
        try {
            this._passwordEnabled = await this.isPasswordEnabled();
        } catch (error) {
            console.log(error);
            this.goBack();
        }
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return null;
    }

    // #endregion

    private async isPasswordEnabled(): Promise<boolean> {
        return await this.humanResourcesService.verifyModuleHasPassword();
    }

    private async enablePassword() {

        const alert = await this.alertController.create({
            header: 'Prompt!',
            inputs: [
              {
                name: 'PASSWORD',
                type: 'text',
                label: '#PASSWORD',
                // min: 4,
                // max: 4
              }
            ],
            buttons: [
              {
                text: '#Cancel',
                role: 'cancel',
                cssClass: 'secondary'
              }, {
                text: '#Ok',
                handler: (value: any) => {
                    this.validateAndEnablePassword(value.PASSWORD);
                }
              }
            ]
          });

          await alert.present();
    }

    private async disablePassword() {

        const confirmationHandler = async (password: string) => {
            await this.showLoading();

            try {
                const validPassword = await this.humanResourcesService.verifyModulePassword(password);
                if (validPassword) {
                    await this.humanResourcesService.removeModulePassword();
                    this._passwordEnabled = false;
                } else {
                    this._passwordEnabled = true;
                    this.showAlertModal('THE PASSWORD WAS INVALID');
                }
            } catch (error) {
                console.log(error);
                this._passwordEnabled = true;
            }

            await this.hideLoading();
        };

        const alert = await this.alertController.create({
            header: '# Validate password',
            inputs: [
              {
                name: 'PASSWORD',
                type: 'text',
                label: '#PASSWORD'
                // min: 4,
                // max: 4
              }
            ],
            buttons: [
              {
                text: '#Cancel',
                role: 'cancel',
                cssClass: 'secondary'
              }, {
                text: '#Ok',
                handler: (value: any) => {
                    confirmationHandler(value.PASSWORD);
                }
              }
            ]
          });

          await alert.present();
    }

    private async validateAndEnablePassword(password: string) {
        if (!password || password.length === 0) {
            await this.showAlertModal('#THE PASSWORD IS NOT VALID');
            this._passwordEnabled = false;
            return;
        }

        const result = await this.humanResourcesService.setModulePassword(password);

        if (!result) {
            await this.showAlertModal('#ERROR STORING PASSWORD');
            this._passwordEnabled = false;
        }
    }


    private async showAlertModal(message: string) {
        const okButton = await this.translateService.get('SHARED.ALERTS.OK').toPromise();
        const alert = await this.alertController.create({
            header: message,
            buttons: [okButton]
          });

          await alert.present();
    }
}
