import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { COSTUMERS_ROUTING } from './costumers.routes';
// import { ENTRY_COMPONENTS, COMPONENTS } from './components';
// import { SERVICES, SalesService } from './services';
import { ModulesSummariesService } from '../core/services';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        COSTUMERS_ROUTING
    ],
    declarations: [PAGES],
    entryComponents: [],
    providers: []
})
export class CostumersModule {
    // constructor(
    //     private modulesSummariesService: ModulesSummariesService,
    //     private salesService: SalesService
    // ) {
    //     this.modulesSummariesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    // }
}
