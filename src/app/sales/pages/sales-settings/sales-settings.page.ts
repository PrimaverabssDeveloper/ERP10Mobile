import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController, MenuController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider, SalesSettingsService } from '../../services';

/**
 * Settings for the sales module.
 *
 * @export
 * @class SalesSettingsPage
 * @extends {PageBase}
 * @implements {OnInit}
 */
@Component({
    templateUrl: 'sales-settings.page.html',
    styleUrls: [
        'sales-settings.page.scss',
        '../../../shared/styles/settings.scss'
    ],
    providers: [SalesServiceProvider]
})
export class SalesSettingsPage extends PageBase implements OnInit {

    // #region 'Private Properties'
    _useReferenceCurrency: boolean;
    _showAggregateData: boolean;
    _showDailySales: boolean;
    // #endregion


    // #region 'Public Properties'
    get useReferenceCurrency(): boolean {
        return this._useReferenceCurrency;
    }

    set useReferenceCurrency(value: boolean) {
        this._useReferenceCurrency = value;
        this.storeSettings();
    }

    get showAggregateData(): boolean {
        return this._showAggregateData;
    }

    set showAggregateData(value: boolean) {
        this._showAggregateData = value;
        this.storeSettings();
    }

    get showDailySales(): boolean {
        return this._showDailySales;
    }

    set showDailySales(value: boolean) {
        this._showDailySales = value;
        this.storeSettings();
    }
    // #endregion

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private salesService: SalesService,
        private salesSettingsService: SalesSettingsService
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
            const settings = await this.salesSettingsService.getSettingsAsync();

            this._useReferenceCurrency = settings.useReferenceCurrency;
            this._showDailySales = settings.showDailySales;
            this._showAggregateData = settings.showAggregateData;
        } catch (error) {
            console.log(error);
        }
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return null;
    }

    // #endregion

    private storeSettings() {
        this.salesSettingsService.updateSettingsAsync({
            useReferenceCurrency: this._useReferenceCurrency,
            showAggregateData: this._showAggregateData,
            showDailySales: this._showDailySales
        });
    }
}
