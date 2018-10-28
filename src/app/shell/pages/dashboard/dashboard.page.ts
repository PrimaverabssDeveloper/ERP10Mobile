import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Module } from '../../../core/entities';
import { InstancesService } from '../../../core/services';

import { BasePage } from '../../../shared/pages';


@Component({
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends BasePage implements OnInit, OnDestroy {

    // #region 'Private Fields'
    private subscriptions: Subscription[] = [];
    // #endregion

    // #region 'Public Properties'

    modules: Module[];

    salesModuleEnabled: boolean;
    humanResourcesModuleEnabled: boolean;
    customersModuleEnabled: boolean;

    // #endregion

    // #region 'Constructor'

    constructor(
        private instancesService: InstancesService,
        public menuController: MenuController,
        public loadingController: LoadingController) {
        super(loadingController);
    }

    // #endregion


    // #region 'Public Properties'

    /**
    * Execute on page initialization.
    *
    * @memberof DashboardPage
    */
    async ngOnInit() {

        await this.showLoading();

        if (!this.modules) {
            const sub =
                this.instancesService
                    .getInstanceModules()
                    .subscribe(ms => {
                        this.modules = ms;

                        // since this is an operation that will change the UI
                        // and is performed from an callback,
                        // it must be executed inside an setTimeout
                        // to speed up the UI update
                        this.hideLoading()
                            .then(() => {
                                this.updateModulesAvailability(ms);
                            });

                    });

            this.subscriptions.push(sub);
        }
    }

    /**
    * Execute on page termination.
    *
    * @memberof DashboardPage
    */
    ngOnDestroy(): void {
        this.modules = null;

        // unsubscrive all subscriptions made.
        // this will prevent 'zombie' subscriptions.
        if (this.subscriptions) {
            for (const s of this.subscriptions) {
                if (!s.closed) {
                    s.unsubscribe();
                }
            }

            this.subscriptions = null;
        }
    }

    // #endregion


    // #region 'Private Methods'

    private updateModulesAvailability(modules: Module[]) {
        if (!modules) {
            return;
        }

        for (const m of modules) {
            switch (m.name) {
                case 'Sales':
                    this.salesModuleEnabled = true;
                    break;
                case 'HumanResources':
                    this.humanResourcesModuleEnabled = true;
                    break;
                case 'Customers':
                    this.customersModuleEnabled = true;
                    break;
                default:
                    break;
            }
        }
    }

    // #endregion
}
