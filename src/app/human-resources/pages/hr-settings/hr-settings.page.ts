import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { PinService } from '../../services/pin.service';

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
    ]
})
export class HrSettingsPage extends PageBase implements OnInit {

    // #region 'Private Properties'
    _pinEnabled: boolean;
    // #endregion


    // #region 'Public Properties'
    get pinEnabled(): boolean {
        return this._pinEnabled;
    }

    set pinEnabled(value: boolean) {
        this._pinEnabled = value;
        if (value) {
            this.enablePin();
        } else {
            this.disablePin();
        }
    }
    // #endregion

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private translateService: TranslateService,
        private pinService: PinService,
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
            this._pinEnabled = await this.isPinEnabled();
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

    private async isPinEnabled(): Promise<boolean> {
        return await this.pinService.verifyModuleHasPin();
    }

    private async enablePin() {
        this._pinEnabled = await this.pinService.enablePinDialog();
    }

    private async disablePin() {
        this._pinEnabled = !await this.pinService.disablePinDialog();
    }
}
