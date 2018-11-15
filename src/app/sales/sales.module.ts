import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { SALES_ROUTING } from './sales.routes';
import { ENTRY_COMPONENTS, COMPONENTS } from './components';
import { SalesService, SalesServiceProvider } from './services';
import { ModulesSummariesService } from '../core/services';
import { SharedModule } from '../shared/shared.module';

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
        private modulesSummariesService: ModulesSummariesService,
        private salesService: SalesService
    ) {
        this.modulesSummariesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    }
}
