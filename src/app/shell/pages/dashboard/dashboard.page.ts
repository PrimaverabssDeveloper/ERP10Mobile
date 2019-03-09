import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Module, Ticker, ModuleDefinition } from '../../../core/entities';
import { InstanceService, ModulesService, AuthenticationService } from '../../../core/services';

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

    /**
     * The collection of modules definitions available to the user.
     *
     * @type {ModuleDefinition[]}
     * @memberof DashboardPage
     */
    modulesDefinitions: ModuleDefinition[];

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
     * @type {Ticker[]}
     * @memberof DashboardPage
     */
    tickers: Ticker[];

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
        private instancesService: InstanceService,
        private modulesService: ModulesService,
        public menuController: MenuController,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public location: Location,
    ) {
        super(loadingController, location, menuController);

        this.modulesDefinitions = [];
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

        if (this.modulesDefinitions && this.modulesDefinitions.length > 0) {
            return;
        }

        this.modulesDefinitions = await this.modulesService.getAvailabeModulesDefinitions();

        try {
            await this.showLoading();

            // get modules summaries and update the interface
            await this.updateTickers();

            await this.hideLoading();
        } catch (error) {
            console.log(error);
        }

        // update tickers when summaries visibility changes changes
        this.modulesService
            .onModulesSummariesVisibilityChanges
            .subscribe(() => {
                this.updateTickers();
            });
    }

    /**
    * Execute on page termination.
    *
    * @memberof DashboardPage
    */
    ngOnDestroy(): void {
        this.modulesDefinitions = null;

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

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'shell-dashboard-page-menu';
    }

    // #endregion


    // #region 'Private Methods'

    // private async getModules(): Promise<Module[]> {

    //     return new Promise<Module[]>((resolve, reject) => {
    //         this.instancesService
    //             .getInstanceModules()
    //             .subscribe(
    //                 res => resolve(res),
    //                 err => reject(err)
    //             );
    //     });
    // }

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

    private async updateTickers(): Promise<any> {
        const moduleTickers = await this.modulesService.getAllAvailableModulesSummariesTickers();
        this.tickers.splice(0, this.tickers.length);
        for (const moduleTicker of moduleTickers) {
            for (const ticker of moduleTicker.tickers) {
                this.tickers.push(ticker);
            }
        }
    }

    // #endregion
}
