import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { SALES_ROUTING } from './sales.routes';
import { ENTRY_COMPONENTS } from './components';
import { SERVICES, SalesService } from './services';
import { ModulesSummariesService } from '../core/services';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SALES_ROUTING
    ],
    declarations: [PAGES, ENTRY_COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS],
    providers: [SERVICES]
})
export class SalesModule {
    constructor(
        private modulesSummariesService: ModulesSummariesService,
        private salesService: SalesService
    ) {
        this.modulesSummariesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    }
}
