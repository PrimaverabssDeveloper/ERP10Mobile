import { Injectable } from '@angular/core';
import { Ticker, ModuleDefinition } from '../entities';
import { InstanceService } from './instance.service';
import { CoreStorageService } from './core-storage.service';

/**
 * Provides access to all available modules definitions.
 *
 * @export
 * @class ModulesService
 */
@Injectable({
    providedIn: 'root',
})
export class ModulesService {

    private readonly MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY = 'MODULES_SUMMARIES_VISIBILITY_STATE';

    private modulesDefinitions: { [moduleKey: string]: ModuleDefinition };

    // private modulesSummariesHandlers: {[moduleKey: string]: () => Promise<HTMLElement[]>} ;

    constructor(private instanceService: InstanceService, private coreStorageService: CoreStorageService) {
        // this.modulesSummariesHandlers = {};
        this.modulesDefinitions = {};
    }

    addModuleDefinition(moduleDefinition: ModuleDefinition) {
        this.modulesDefinitions[moduleDefinition.key] = moduleDefinition;
    }

    /**
     * Provides the definitions to the availble modules for the current user.
     *
     * @returns {ModuleDefinition[]}
     * @memberof ModulesService
     */
    async getAvailabeModulesDefinitions(): Promise<ModuleDefinition[]> {
        const availableModules = this.instanceService.currentInstance.modules;
        const availableModulesDefinitions: ModuleDefinition[] = [];

        const visibilityState = await this.coreStorageService
            .getData<{ [key: string]: boolean }>(this.MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY, true);

        for (const m of availableModules) {
            const moduleDef = this.modulesDefinitions[m.name];
            if (moduleDef) {
                if (moduleDef.summaries.hasSummaries) {
                    moduleDef.summaries.visible = visibilityState ? visibilityState[moduleDef.key] !== false : true;
                }
                availableModulesDefinitions.push(moduleDef);
            }
        }

        return availableModulesDefinitions;
    }

    async getAllAvailableModulesSummariesTickers(): Promise<{ moduleKey: string, tickers: Ticker[] }[]> {
        const summariesTickers: { moduleKey: string, tickers: Ticker[] }[] = [];
        let error: any;

        try {
            // get modules with summaries
            const availableModulesDefs = await this.getAvailabeModulesDefinitions();

            // filter the modules with enabled summaries
            const modulesWithVisibleSummaries = availableModulesDefs.filter(m =>
                m.summaries &&
                m.summaries.hasSummaries &&
                m.summaries.summariesHandler &&
                m.summaries.visible);

            for (const moduleDefinition of modulesWithVisibleSummaries) {

                const htmlElements = await moduleDefinition.summaries.summariesHandler();

                const tickers: Ticker[] = [];

                for (const htmlElement of htmlElements) {
                    tickers.push({
                        title: moduleDefinition.localizedNameKey,
                        content: htmlElement
                    });
                }

                summariesTickers.push({
                    moduleKey: moduleDefinition.key,
                    tickers: tickers
                });
            }
        } catch (err) {
            error = err;
        }

        return new Promise<{ moduleKey: string, tickers: Ticker[] }[]>((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                resolve(summariesTickers);
            }
        });
    }

    async setModuleSummariesVisibilityState(moduleDefinition: ModuleDefinition, visible: boolean) {
        let visibilityState = await this.coreStorageService
            .getData<{[key: string]: boolean }>(this.MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY, true);

        if (!visibilityState) {
            visibilityState = {};
        }

        visibilityState[moduleDefinition.key] = visible;

        await this.coreStorageService
                  .setData<{[key: string]: boolean}>(this.MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY, visibilityState, true);
    }
}
