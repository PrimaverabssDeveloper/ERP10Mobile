import { Injectable } from '@angular/core';
import { Ticker } from '../entities';
import { ModuleDefinition } from '../entities/module-definition';

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

    constructor() {
        // this.modulesSummariesHandlers = {};
        this.modulesDefinitions = {};
    }

    addModuleDefinition(moduleDefinition: ModuleDefinition) {
        if (this.modulesDefinitions.hasOwnProperty(moduleDefinition.key)) {
            throw new Error(`Module with key "${moduleDefinition.key}" alredy defined`);
        }

        this.modulesDefinitions[moduleDefinition.key] = moduleDefinition;
    }

    // addModuleSummariesHandler(moduleKey: string, summariesHandler: () => Promise<HTMLElement[]>) {
    //     this.modulesSummariesHandlers[moduleKey] = summariesHandler;
    // }

    async getAllModulesSummariesTickers(): Promise<{ moduleKey: string, tickers: Ticker[] }[]> {
        const summariesTickers: { moduleKey: string, tickers: Ticker[] }[] = [];
        let error: any;

        try {
            for (const moduleKey in this.modulesDefinitions) {

                // verify if the modulesDefinitions realy has the module definition.
                if (!this.modulesDefinitions.hasOwnProperty(moduleKey)) {
                    continue;
                }

                const moduleDefinition = this.modulesDefinitions[moduleKey];

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
                        title: moduleKey,
                        content: htmlElement
                    });
                }

                summariesTickers.push({
                    moduleKey: moduleKey,
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
