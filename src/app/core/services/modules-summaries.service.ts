import { Injectable, EmbeddedViewRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModulesSummariesService {

    private modulesSummariesHandlers: {[moduleKey: string]: () => Promise<HTMLElement[]>} ;

    constructor() {
        this.modulesSummariesHandlers = {};
    }

    addModuleSummariesHandler(moduleKey: string, summariesHandler: () => Promise<HTMLElement[]>) {
        this.modulesSummariesHandlers[moduleKey] = summariesHandler;
    }

    async getAllModulesSummariesTickers(): Promise<{moduleKey: string, tickers: HTMLElement[]}[]> {
        const summariesTickers: {moduleKey: string, tickers: HTMLElement[]}[] = [];
        let error: any;

        try {
            for (const moduleKey in this.modulesSummariesHandlers) {

                if (this.modulesSummariesHandlers.hasOwnProperty(moduleKey)) {
                    const handler = this.modulesSummariesHandlers[moduleKey];
                    const htmlElements = await handler();

                    summariesTickers.push({
                        moduleKey: moduleKey,
                        tickers: htmlElements
                    });
                }
            }
        } catch (err) {
            error = err;
        }

        return new Promise<{moduleKey: string, tickers: HTMLElement[]}[]>((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                resolve(summariesTickers);
            }
        });
    }
}
