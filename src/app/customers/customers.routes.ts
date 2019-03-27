import { RouterModule, Routes } from '@angular/router';
import {
    CustomersListPage,
    CustomerPage,
    OtherContactsPage,
    OtherAddressesPage,
    PendingOrdersPage,
    FinancialDocumentPage,
    FinancialDocumentLinePage,
    CurrentAccountPage,
    RecentActivityPage,
    SalesChartsPage
} from './pages';

const customersRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'customers-list',
                pathMatch: 'full'
            },
            {
                path: 'customers-list',
                component: CustomersListPage
            },
            {
                path: 'customer/:companyKey/:customerKey',
                component: CustomerPage
            },
            {
                path: 'customer/:companyKey/:customerKey/othercontacts',
                component: OtherContactsPage
            },
            {
                path: 'customer/:companyKey/:customerKey/otheraddresses',
                component: OtherAddressesPage
            },
            {
                path: 'customer/:companyKey/:customerKey/pendingorders',
                component: PendingOrdersPage
            },
            {
                path: 'customer/:companyKey/:customerKey/currentaccount',
                component: CurrentAccountPage
            },
            {
                path: 'customer/:companyKey/:customerKey/recentactivity',
                component: RecentActivityPage
            },
            {
                path: 'customer/:companyKey/:customerKey/salescharts',
                component: SalesChartsPage
            },
            {
                path: 'customer/finantialdocument',
                component: FinancialDocumentPage
            },
            {
                path: 'customer/finantialdocumentline',
                component: FinancialDocumentLinePage
            }

        ]
    }
];

export const CUSTOMERS_ROUTING = RouterModule.forChild(customersRoutes);
