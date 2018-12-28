import { Injectable } from '@angular/core';
import { Ticker, ModuleDefinition } from '../entities';
import { InstanceService } from './instance.service';

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

    private modulesDefinitions: { [moduleKey: string]: ModuleDefinition };

    // private modulesSummariesHandlers: {[moduleKey: string]: () => Promise<HTMLElement[]>} ;

    constructor(private instanceService: InstanceService) {
        // this.modulesSummariesHandlers = {};
        this.modulesDefinitions = {};
    }

    addModuleDefinition(moduleDefinition: ModuleDefinition) {
        this.modulesDefinitions[moduleDefinition.key] = moduleDefinition;
    }

    // addModuleSummariesHandler(moduleKey: string, summariesHandler: () => Promise<HTMLElement[]>) {
    //     this.modulesSummariesHandlers[moduleKey] = summariesHandler;
    // }

    /**
     * Provides the definitions to the availble modules for the current user.
     *
     * @returns {ModuleDefinition[]}
     * @memberof ModulesService
     */
    getAvailabeModulesDefinitions(): ModuleDefinition[] {
        const availableModules = this.instanceService.currentInstance.modules;
        const availableModulesDefinitions: ModuleDefinition[] = [];

        for (const m of availableModules) {
            const moduleDef = this.modulesDefinitions[m.name];
            if (moduleDef) {
                availableModulesDefinitions.push(moduleDef);
            }
        }

        return availableModulesDefinitions;
    }

    async getAllAvailableModulesSummariesTickers(): Promise<{ moduleKey: string, tickers: Ticker[] }[]> {
        const summariesTickers: { moduleKey: string, tickers: Ticker[] }[] = [];
        let error: any;

        try {
            const availableModulesDefs = this.getAvailabeModulesDefinitions();
            for (const moduleDefinition of availableModulesDefs) {

                // verify if the module has summaries
                if (!moduleDefinition.summaries ||
                    !moduleDefinition.summaries.hasSummaries ||
                    !moduleDefinition.summaries.summariesHandler) {
                    continue;
                }

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
}
