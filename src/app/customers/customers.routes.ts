import { RouterModule, Routes } from '@angular/router';
import { CustomersListPage, CustomerPage, OtherContactsPage } from './pages';

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
            }
        ]
    }
];

export const CUSTOMERS_ROUTING = RouterModule.forChild(customersRoutes);
