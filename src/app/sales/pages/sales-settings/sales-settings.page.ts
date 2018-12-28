import { Component, OnInit } from '@angular/core';

import { LoadingController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';

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
    }

    get showAggregateData(): boolean {
        return this._showAggregateData;
    }

    set showAggregateData(value: boolean) {
        this._showAggregateData = value;
    }

    get showDailySales(): boolean {
        return this._showDailySales;
    }

    set showDailySales(value: boolean) {
        this._showDailySales = value;
    }
    // #endregion

    constructor(
        public loadingController: LoadingController,
        private salesService: SalesService
    ) {
        super(loadingController);
    }

    async ngOnInit() {

    }
}
