import { Component, OnInit } from '@angular/core';
import { InstancesService } from '../../../core/services';
import { Instance } from '../../../core/entities';
import { Router } from '@angular/router';

import { BasePage } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';

@Component({
    templateUrl: 'instances.page.html',
    styleUrls: ['instances.page.scss'],
})
export class InstancesPage extends BasePage implements OnInit {

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
     * @param {InstancesService} instancesService
     * @param {Router} router
     * @memberof InstancesPage
     */
    constructor(private instancesService: InstancesService, private router: Router, public loadingController: LoadingController) {
        super(loadingController);
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

        this.instancesService
            .getInstances()
            .subscribe((instances) => {
                this.hideLoading()
                    .then(() => {
                        this.handleInstances(instances);
                    });
            });
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

        this.selectInstance(instance);
    }

    // #endregion

    // #region 'Private Methods'

    private handleInstances(instances: Instance[]) {
        if (!instances || instances.length === 0) {
            // TODO: show message that there is not instances

            return;
        }

        // Only one instance.
        // Select automaticaly.
        if (instances.length === 1) {
            this.selectInstance(instances[0]);
            return;
        }

        this.instances = instances;
    }

    private selectInstance(instance: Instance) {
        if (!instance) {
            console.log('the instance to select can not be null');
            return;
        }

        this.instancesService.currentInstance = instance;

        this.router.navigate(['/shell/dashboard']);
    }

    // #endregion

}
