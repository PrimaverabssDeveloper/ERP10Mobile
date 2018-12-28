import { Component, ViewChild, OnInit } from '@angular/core';

import { PopoverController, LoadingController } from '@ionic/angular';
import { CompanySelectorComponent, FooterTabMenu, FooterMenuItemSelectedEvent } from '../../components';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';
import { Company, SalesCharts, CompanySales, ChartBundle, ChartData, Serie } from '../../entities';
import { LocaleService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';

@Component({
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss'],
    providers: [SalesServiceProvider]
})
export class SettingsPage extends PageBase implements OnInit {

    constructor(
        public loadingController: LoadingController,
        private salesService: SalesService,
    ) {
        super(loadingController);
    }

    async ngOnInit() {

    }
}
