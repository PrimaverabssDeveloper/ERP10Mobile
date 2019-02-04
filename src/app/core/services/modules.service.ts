import { Injectable, EventEmitter } from '@angular/core';
import { Ticker, ModuleDefinition } from '../entities';
import { InstanceService } from './instance.service';
import { CoreStorageService } from './core-storage.service';
import { Observable } from 'rxjs';

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
    private _onModulesSummariesVisibilityChanges: EventEmitter<any>;
    private modulesDefinitions: { [moduleKey: string]: ModuleDefinition };

    get onModulesSummariesVisibilityChanges(): Observable<any> {
        return this._onModulesSummariesVisibilityChanges.asObservable();
    }

    constructor(private instanceService: InstanceService, private coreStorageService: CoreStorageService) {
        // this.modulesSummariesHandlers = {};
        this.modulesDefinitions = {};
        this._onModulesSummariesVisibilityChanges = new EventEmitter();
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

        const visibilityState = await this.getModulesVisibilityStateAsync();

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
        let visibilityState = await this.getModulesVisibilityStateAsync();

        if (!visibilityState) {
            visibilityState = {};
        }

        visibilityState[moduleDefinition.key] = visible;

        await this.coreStorageService
                  .setData<{[key: string]: boolean}>(this.MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY, visibilityState, true);

        this._onModulesSummariesVisibilityChanges.emit();
    }

    private async getModulesVisibilityStateAsync(): Promise<{ [key: string]: boolean }> {
        let visibilityState: { [key: string]: boolean } = null;
        try {
            visibilityState = await this.coreStorageService
                .getData<{ [key: string]: boolean }>(this.MODULES_SUMMARIES_VISIBILITY_STATE_STORAGE_KEY, true);
        } catch (error) {
            console.log(error);
        }

        return visibilityState;
    }
}
