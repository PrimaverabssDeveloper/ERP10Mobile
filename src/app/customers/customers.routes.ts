import { RouterModule, Routes } from '@angular/router';
import { CustomersListPage } from './pages';

const customersRoutes: Routes = [
    {
      path: '',
      component: CustomersListPage
    //   children: [
    //         {
    //             path: '',
    //             redirectTo: 'home',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'home',
    //             component: HomePage
    //         }
    //     ]
    }
];

export const CUSTOMERS_ROUTING = RouterModule.forChild(customersRoutes);
