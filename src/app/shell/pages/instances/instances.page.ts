import { Component, OnInit } from '@angular/core';
import { Instance } from '../../../core/entities';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PageBase } from '../../../shared/pages';
import { LoadingController, NavController, MenuController } from '@ionic/angular';
import { InstancesServiceProvider, InstancesService } from '../../services';
import { InstanceService } from '../../../core/services';

@Component({
    templateUrl: 'instances.page.html',
    styleUrls: ['instances.page.scss'],
    providers: [InstancesServiceProvider]
})
export class InstancesPage extends PageBase implements OnInit {

    // #region 'Public Properties'

    /**
     * Collection of instances;
     *
     * @type {Instance[]}
     * @memberof InstancesPage
     */
    instances: Instance[];

    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of InstancesPage.
     * @param {InstanceService} instancesService
     * @param {Router} router
     * @memberof InstancesPage
     */
    constructor(
        private instanceService: InstanceService,
        private instancesService: InstancesService,
        private route: ActivatedRoute,
        private navController: NavController,
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController
        ) {
        super(loadingController, location, menuController);
    }

    // #endregion

    // #region 'Public Methods'

    /**
     * Execute on page initialization.
     *
     * @memberof InstancesPage
     */
    async ngOnInit() {

        await this.showLoading();

        let instances: Instance[];

        const instancesJson = this.route.snapshot.queryParams['instances'];
        if (instancesJson) {
            instances = JSON.parse(instancesJson);
        } else {
            instances = await this.instancesService.getInstancesAsync();
        }

        this.handleInstancesAsync(instances);

        this.hideLoading();
    }

    /**
     * Actions called on the UI when an instance is selected.
     *
     * @param {Instance} instance
     * @returns
     * @memberof InstancesPage
     */
    selectInstanceAction(instance: Instance) {
        if (!instance) {
            return;
        }

        this.selectInstanceAsync(instance);
    }

    // #endregion

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return null;
    }

    // #endregion

    // #region 'Private Methods'

    private async handleInstancesAsync(instances: Instance[]) {
        if (!instances || instances.length === 0) {
            // TODO: show message that there is not instances
            return;
        }

        // // Only one instance.
        // // Select automaticaly.
        // if (instances.length === 1) {
        //     await this.selectInstanceAsync(instances[0]);
        //     return;
        // }

        this.instances = instances;
    }

    private async selectInstanceAsync(instance: Instance) {
        if (!instance) {
            console.log('the instance to select can not be null');
            return;
        }

        await this.instanceService.setCurrentInstanceAsync(instance);
        this.navController.navigateRoot('/shell/dashboard', { replaceUrl: true});
    }

    // #endregion

}
