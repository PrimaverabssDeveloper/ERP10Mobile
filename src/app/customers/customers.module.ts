import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { CUSTOMERS_ROUTING } from './customers.routes';
// import { ENTRY_COMPONENTS, COMPONENTS } from './components';
// import { SERVICES, SalesService } from './services';
import { ModulesSummariesService, AuthenticationService } from '../core/services';
import { CustomersService, CustomersDemoService } from './services';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CUSTOMERS_ROUTING
    ],
    declarations: [PAGES],
    entryComponents: [],
    providers: []
})
export class CustomersModule {
    // constructor(
    //     private modulesSummariesService: ModulesSummariesService,
    //     private salesService: SalesService
    // ) {
    //     this.modulesSummariesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    // }
}
