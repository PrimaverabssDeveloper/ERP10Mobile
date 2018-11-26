import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages';

const salesRoutes: Routes = [
    {
      path: '',
      component: HomePage
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

export const SALES_ROUTING = RouterModule.forChild(salesRoutes);
