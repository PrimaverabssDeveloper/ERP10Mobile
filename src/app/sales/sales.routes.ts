import { RouterModule, Routes } from '@angular/router';
import { HomePage, SalesSettingsPage } from './pages';

const salesRoutes: Routes = [
    {
      path: '',
      children: [
          {
              path: '',
              redirectTo: 'home',
              pathMatch: 'full'
          },
          {
              path: 'home',
              component: HomePage
          },
          {
              path: 'settings',
              component: SalesSettingsPage
          }
        ]
    }
];

export const SALES_ROUTING = RouterModule.forChild(salesRoutes);
