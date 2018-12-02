import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { CUSTOMERS_ROUTING } from './customers.routes';
// import { ENTRY_COMPONENTS, COMPONENTS } from './components';
// import { SERVICES, SalesService } from './services';
import { ModulesSummariesService, AuthenticationService } from '../core/services';
import { CustomersService, CustomersDemoService, MODULE_SERVICES } from './services';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { COMPONENTS } from './components';
import { PIPES } from './pipes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SharedModule,
        CUSTOMERS_ROUTING
    ],
    declarations: [PAGES, COMPONENTS, PIPES],
    entryComponents: [],
    providers: [
        MODULE_SERVICES,
        DatePipe,
        CurrencyPipe
    ]
})
export class CustomersModule {
    // constructor(
    //     private modulesSummariesService: ModulesSummariesService,
    //     private salesService: SalesService
    // ) {
    //     this.modulesSummariesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    // }
}
