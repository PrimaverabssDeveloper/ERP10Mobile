import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MenuController, LoadingController, Menu, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Module } from '../../../core/entities';
import { InstancesService, ModulesSummariesService, AuthenticationService } from '../../../core/services';

import { PageBase } from '../../../shared/pages';
import { ModuleSummary } from '../../entities';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends PageBase implements OnInit, OnDestroy {

    // #region 'Private Properties'

    private subscriptions: Subscription[] = [];

    // #endregion

    // #region 'Public Properties'

    @ViewChild('menu') menu: Menu;

    /**
     * The collection of modules available to the user.
     *
     * @type {Module[]}
     * @memberof DashboardPage
     */
    modules: Module[];

    /**
     * The collection do summaries from the modules that the user has access
     * and that has summary data.
     *
     * @type {ModuleSummary[]}
     * @memberof DashboardPage
     */
    modulesSummaries: ModuleSummary[];

    /**
     * HTML Elements from all tickers from the modules that provide tickers.
     *
     * @type {HTMLElement[]}
     * @memberof DashboardPage
     */
    tickers: HTMLElement[];

    /**
     * Defines if the user has access to the sales module.
     *
     * @type {boolean}
     * @memberof DashboardPage
     */
    salesModuleEnabled: boolean;

    /**
     * Defines if the user has access to the Human Resources module.
     *
     * @type {boolean}
     * @memberof DashboardPage
     */
    humanResourcesModuleEnabled: boolean;

    /**
     * Defines if the user has access to the Costumer module.
     *
     * @type {boolean}
     * @memberof DashboardPage
     */
    customersModuleEnabled: boolean;

    // #endregion

    // #region 'Constructor'

    constructor(
        private instancesService: InstancesService,
        private modulesSummariesService: ModulesSummariesService,
        private authenticationService: AuthenticationService,
        private translateService: TranslateService,
        private router: Router,
        public menuController: MenuController,
        public loadingController: LoadingController,
        public alertController: AlertController
    ) {
        super(loadingController);

        this.modules = [];
        this.modulesSummaries = [];
        this.tickers = [];
    }

    // #endregion


    // #region 'Public Properties'

    /**
    * Execute on page initialization.
    *
    * @memberof DashboardPage
    */
    async ngOnInit() {

        if (this.modules && this.modules.length > 0) {
            return;
        }

        try {
            await this.showLoading();

            // get modules and show the modules icons on interface
            this.modules = await this.getModules();
            this.updateModulesAvailability(this.modules);

            // get modules summaries and update the interface
            // this.modulesSummaries = await this.getModulesSummaries(this.modules);
            const moduleTickers = await this.modulesSummariesService.getAllModulesSummariesTickers();
            for (const moduleTicker of moduleTickers) {
                for (const ticker of moduleTicker.tickers) {
                    this.tickers.push(ticker);
                }
            }

            await this.hideLoading();
        } catch (error) {
            console.log(error);
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

    /**
     * Show's logout confirmation window.
     *
     * @memberof DashboardPage
     */
    async logoutAction() {
        const header = await this.translateService.get('SHELL.DASHBOARD_PAGE.ALERT_LOGOUT_HEADER').toPromise();
        const message = await this.translateService.get('SHELL.DASHBOARD_PAGE.ALERT_LOGOUT_MESSAGE').toPromise();

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

    // #endregion


    // #region 'Private Methods'

    private async getModules(): Promise<Module[]> {

        return new Promise<Module[]>((resolve, reject) => {
            this.instancesService
                .getInstanceModules()
                .subscribe(
                    res => resolve(res),
                    err => reject(err)
                );
        });
    }

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

    private async getModulesSummaries(modules: Module[]): Promise<ModuleSummary[]> {

        return new Promise<ModuleSummary[]>((resolve, reject) => {

            // no data to get
            if (modules.length === 0) {
                resolve([]);
                return;
            }

            const modulesSummaries: ModuleSummary[] = [];
            let remainRequestModules = modules.length;

            const onModuleSummaryDataReady = (module: Module, data: any) => {

                // decrease the remain modules to be handled
                remainRequestModules--;

                if (data) {
                    modulesSummaries.push({
                        module: module,
                        data: data
                    });
                }

                // all the modules summaries have been requested.
                // call 'resolve' to return the values
                if (remainRequestModules === 0) {
                    resolve(modulesSummaries);
                }
            };

            // request summaries to all modules.
            // not all modules has summaries.
            // To simplify, in this case if there is an error requesting the data
            // it will be handled as if the module don't have summary data
            for (const m of modules) {
                this.instancesService
                    .getModuleSummary(m)
                    .subscribe(
                        data => onModuleSummaryDataReady(m, data),
                        err => onModuleSummaryDataReady(m, null)
                    );
            }
        });
    }

    private async logout() {
        await this.authenticationService.endSession();
        this.router.navigate(['/shell/authentication']);
    }
    // #endregion
}
