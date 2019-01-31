import { Component, OnInit } from '@angular/core';
import { ModuleDefinition } from '../../../core/entities';
import { ModulesService } from '../../../core/services';

@Component({
    templateUrl: './ticker-settings.page.html',
    styleUrls: [
        '../../../shared/styles/settings.scss',
        './ticker-settings.page.scss'
    ]
})
export class TickerSettingsPage implements OnInit {
    modulesDefinitionsWithTicker: ModuleDefinition[];

    constructor(private modulesService: ModulesService ) {
    }

    /**
    * Execute on page initialization.
    *
    * @memberof TickerSettingsPage
    */
    async ngOnInit() {
        const modulesDefinitions = await this.modulesService.getAvailabeModulesDefinitions();
        this.modulesDefinitionsWithTicker = modulesDefinitions.filter(m => m.summaries && m.summaries.hasSummaries);
    }

    /**
     * On change module summary visibility toggle action.
     *
     * @param {ModuleDefinition} moduleDefinition
     * @memberof TickerSettingsPage
     */
    async onChangeAction(moduleDefinition: ModuleDefinition) {
        // change the visibility from the module to update the UX.
        moduleDefinition.summaries.visible = !moduleDefinition.summaries.visible;

        // store the change
        await this.modulesService.setModuleSummariesVisibilityState(moduleDefinition, moduleDefinition.summaries.visible);
    }
}
