import { Component, OnInit } from '@angular/core';

import { LoadingController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';

@Component({
    templateUrl: 'sales-settings.page.html',
    styleUrls: ['sales-settings.page.scss'],
    providers: [SalesServiceProvider]
})
export class SalesSettingsPage extends PageBase implements OnInit {

    constructor(
        public loadingController: LoadingController,
    ) {
        super(loadingController);
    }

    async ngOnInit() {

    }
}
