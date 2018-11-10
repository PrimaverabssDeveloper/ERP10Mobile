import { RouterModule, Routes } from '@angular/router';
import { CostumersListPage } from './pages';

const costumersRoutes: Routes = [
    {
      path: '',
      component: CostumersListPage
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

export const COSTUMERS_ROUTING = RouterModule.forChild(costumersRoutes);
