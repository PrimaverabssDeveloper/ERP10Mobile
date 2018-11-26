import { Injectable, EmbeddedViewRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { Ticker } from '../entities';

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

    async getAllModulesSummariesTickers(): Promise<{moduleKey: string, tickers: Ticker[]}[]> {
        const summariesTickers: {moduleKey: string, tickers: Ticker[]}[] = [];
        let error: any;

        try {
            for (const moduleKey in this.modulesSummariesHandlers) {

                if (this.modulesSummariesHandlers.hasOwnProperty(moduleKey)) {
                    const handler = this.modulesSummariesHandlers[moduleKey];
                    const htmlElements = await handler();

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
            }
        } catch (err) {
            error = err;
        }

        return new Promise<{moduleKey: string, tickers: Ticker[]}[]>((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                resolve(summariesTickers);
            }
        });
    }
}
