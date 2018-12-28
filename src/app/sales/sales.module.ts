import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { SALES_ROUTING } from './sales.routes';
import { ENTRY_COMPONENTS, COMPONENTS } from './components';
import { SalesService, SalesServiceProvider } from './services';
import { ModulesService } from '../core/services';
import { SharedModule } from '../shared/shared.module';
import { ModuleDefinition } from '../core/entities';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        SALES_ROUTING
    ],
    declarations: [PAGES, COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS],
    providers: [SalesServiceProvider]
})
export class SalesModule {
    constructor(
        private modulesService: ModulesService,
        private salesService: SalesService
    ) {

        const moduleDef: ModuleDefinition = {
            key: 'Sales',
            moduleRoutePath: '/sales',
            iconPath: '../../assets/sales/sales_logo.svg',
            localizedNameKey: '#SALES',
            summaries: {
                hasSummaries: true,
                summariesHandler: () => this.salesService.createSalesSummaryTickers()
            },
            settings: {
                hasSettings: true,
                settingsRoutePath: ''
            }
        };

        this.modulesService.addModuleDefinition(moduleDef);

        // this.modulesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    }
}
